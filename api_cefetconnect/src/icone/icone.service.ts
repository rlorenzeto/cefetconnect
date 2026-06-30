import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Icone } from './entities/icone.entity';
import { PossuiIcone } from './entities/possui-icone.entity';
import { Usuario } from '../entities/usuario.entity';
import { GradmentService } from '../gradment/gradment.service';
import { InteracaoService } from '../interacao/interacao.service';
import { ErrorMessages } from '../common/constants/messages.errors.js';
import {
  ICONES_PPC_ENG_COMP,
  CodigoIconePpc,
} from './icone-catalog';

export interface IconeImportadoDto {
  idIcone: number;
  nomeIcone: string;
  descricaoIcone: string;
  codigoIcone: string;
}

export interface ImportarIconesResponseDto {
  adicionados: IconeImportadoDto[];
  duplicados: string[];
  ignorados: string[];
  erro?: string;
}

interface EixoGradmentDto {
  codigo?: string;
  codigoIcone?: string;
  nome?: string;
}

interface RespostaGradmentDto {
  curso?: {
    idCurso?: string;
    nomeCurso?: string;
  };
  usuario?: {
    matricula?: string;
    nomeUsuario?: string;
  };
  eixosFinalizados?: EixoGradmentDto[];
}

@Injectable()
export class IconeService {
  constructor(
    @InjectRepository(Icone)
    private iconeRepository: Repository<Icone>,

    @InjectRepository(PossuiIcone)
    private possuiIconeRepository: Repository<PossuiIcone>,

    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,

    private gradmentService: GradmentService,

    private interacaoService: InteracaoService,
  ) {}

  async importarIconesDoGradment(
    idUsuario: number,
  ): Promise<ImportarIconesResponseDto> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
      select: {
        idUsuario: true,
        email: true,
        nomeUsuario: true,
        tokenIntegracao: true,
      },
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    if (!usuario.tokenIntegracao) {
      throw new BadRequestException(ErrorMessages.EICO00001.mensagem);
    }

    const respostaGradment = (await this.gradmentService.obterEixosCompletados(
      usuario.tokenIntegracao,
    )) as unknown;

    const { eixosFinalizados, periodosFinalizados } = this.extrairConquistas(respostaGradment);

    if (eixosFinalizados.length === 0 && periodosFinalizados.length === 0) {
      return {
        adicionados: [],
        duplicados: [],
        ignorados: [],
        erro: 'Nenhuma conquista encontrada no Gradment.',
      };
    }

    const iconesDoUsuario = await this.possuiIconeRepository.find({
      where: { usuario: { idUsuario } },
      relations: ['icone'],
    });

    const codigosJaPossuidos = new Set(
      iconesDoUsuario.map((pi) => pi.icone.codigoIcone),
    );

    const adicionados: IconeImportadoDto[] = [];
    const duplicados: string[] = [];
    const ignorados: string[] = [];

    const todasConquistas = [
      ...eixosFinalizados.map(e => e.nome ?? e.codigo ?? e.codigoIcone ?? ''),
      ...periodosFinalizados.map(p => `PERIODO_${p.periodo}`),
    ];

    for (const valor of todasConquistas) {
      const codigo = this.normalizarCodigoEixo(valor);

      if (!codigo || !(codigo in ICONES_PPC_ENG_COMP)) {
        ignorados.push(valor || 'Conquista desconhecida');
        continue;
      }

      if (codigosJaPossuidos.has(codigo)) {
        duplicados.push(ICONES_PPC_ENG_COMP[codigo].nomeIcone);
        continue;
      }

      const dadosIcone = ICONES_PPC_ENG_COMP[codigo];

      let icone = await this.iconeRepository.findOne({
        where: { codigoIcone: dadosIcone.codigoIcone },
      });

      if (!icone) {
        icone = await this.iconeRepository.save(
          this.iconeRepository.create(dadosIcone),
        );
      }

      await this.possuiIconeRepository.save(
        this.possuiIconeRepository.create({
          icone,
          usuario,
        }),
      );

      adicionados.push({
        idIcone: icone.idIcone,
        nomeIcone: icone.nomeIcone,
        descricaoIcone: icone.descricaoIcone,
        codigoIcone: icone.codigoIcone,
      });

      codigosJaPossuidos.add(codigo);
    }

    if (adicionados.length > 0) {
      await this.interacaoService.incrementarContador(
        idUsuario,
        adicionados.length * 5,
      );
    }

    return { adicionados, duplicados, ignorados };
  }

  async listarIconesDoUsuario(idUsuario: number): Promise<PossuiIcone[]> {
    return this.possuiIconeRepository.find({
      where: { usuario: { idUsuario } },
      relations: ['icone'],
      order: { dataConquistaIcone: 'DESC' },
    });
  }

  private extrairConquistas(
    respostaGradment: unknown,
  ): { eixosFinalizados: any[]; periodosFinalizados: any[] } {
    if (respostaGradment && typeof respostaGradment === 'object') {
      const resposta = respostaGradment as any;
      return {
        eixosFinalizados: Array.isArray(resposta.eixosFinalizados)? resposta.eixosFinalizados : [],
        periodosFinalizados: Array.isArray(resposta.periodosFinalizados)? resposta.periodosFinalizados : [],
      };
    }

    return { eixosFinalizados: [], periodosFinalizados: [] };
  }

  private normalizarCodigoEixo(valor: string): CodigoIconePpc | null {
    if (!valor) return null;

    if (valor.startsWith('PERIODO_')) {
      return valor as CodigoIconePpc;
    }

    const texto = valor
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase()
      .trim();

    const mapa: Record<string, CodigoIconePpc> = {
      MATEMATICA: 'MATEMATICA',
      'FISICA E QUIMICA': 'FISICA_QUIMICA',
      FISICA_QUIMICA: 'FISICA_QUIMICA',
      HUMANIDADES: 'HUMANIDADES',
      'HUMANIDADES E CIENCIAS SOCIAIS APLICADAS A ENGENHARIA': 'HUMANIDADES',
      ELETRICIDADE: 'ELETRICIDADE',
      ELETRONICA: 'ELETRONICA',
      'CONTROLE DE PROCESSOS': 'CONTROLE_PROCESSOS',
      CONTROLE_PROCESSOS: 'CONTROLE_PROCESSOS',
      'PRATICA PROFISSIONAL E INTEGRACAO CURRICULAR': 'PRATICA_PROFISSIONAL',
      PRATICA_PROFISSIONAL: 'PRATICA_PROFISSIONAL',
      'FUNDAMENTOS DE ENGENHARIA DE COMPUTACAO': 'FUNDAMENTOS_COMP',
      FUNDAMENTOS_COMP: 'FUNDAMENTOS_COMP',
      'ENGENHARIA DE SOFTWARE E BANCO DE DADOS': 'ENG_SOFTWARE_BD',
      ENG_SOFTWARE_BD: 'ENG_SOFTWARE_BD',
      'REDES E SISTEMAS DISTRIBUIDOS': 'REDES_SD',
      REDES_SD: 'REDES_SD',

      'SISTEMAS INTELIGENTES': 'SISTEMAS_INTELIGENTES',
      SISTEMAS_INTELIGENTES: 'SISTEMAS_INTELIGENTES',

      AUTOMACAO: 'AUTOMACAO',
      AUTOMACAO_INDUSTRIAL: 'AUTOMACAO',

      COMPUTACAO_MATEMATICA_APLICADA: 'COMPUTACAO_MATEMATICA_APLICADA',
      'COMPUTACAO E MATEMATICA APLICADA': 'COMPUTACAO_MATEMATICA_APLICADA',

      INFORMATICA_INDUSTRIAL: 'INFORMATICA_INDUSTRIAL',
      'INFORMATICA INDUSTRIAL': 'INFORMATICA_INDUSTRIAL',

      MECANICA: 'MECANICA',
    };

    return mapa[texto] ?? null;
  }
}