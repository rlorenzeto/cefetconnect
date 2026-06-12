import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Icone } from './entities/icone.entity';
import { PossuiIcone } from './entities/possui-icone.entity';
import { Usuario } from '../entities/usuario.entity';
import { GradmentService } from '../gradment/gradment.service';
import { InteracaoService } from '../interacao/interacao.service';
import { ErrorMessages } from '../common/constants/messages.errors.js';

export interface IconeImportadoDto {
  idIcone: number;
  nomeIcone: string;
  descricaoIcone: string;
  codigoIcone: string;
}

export interface ImportarIconesResponseDto {
  adicionados: IconeImportadoDto[];
  duplicados: string[];
  erro?: string;
}

@Injectable()
export class IconeService {
  private readonly logger = new Logger(IconeService.name);

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

  async importarIconesDoGradment(idUsuario: number): Promise<ImportarIconesResponseDto> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
      select: { idUsuario: true, email: true, nomeUsuario: true, tokenIntegracao: true },
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    if (!usuario.tokenIntegracao) {
      throw new BadRequestException(ErrorMessages.EICO00001.mensagem);
    }

    const eixosCompletados = await this.gradmentService.obterEixosCompletados(
      usuario.tokenIntegracao,
    );

    if (!eixosCompletados || eixosCompletados.length === 0) {
      return {
        adicionados: [],
        duplicados: [],
        erro: 'Nenhum eixo completado encontrado no Gradment.',
      };
    }

    const iconesExistentes = await this.possuiIconeRepository.find({
      where: { usuario: { idUsuario } },
      relations: ['icone'],
    });
    const nomesIconesExistentes = new Set(
      iconesExistentes.map((pi) => pi.icone.nomeIcone.toLowerCase()),
    );

    const adicionados: IconeImportadoDto[] = [];
    const duplicados: string[] = [];

    const eixosUnicos = this.agruparPorEixo(eixosCompletados);

    for (const eixo of eixosUnicos) {
      const nomeEixo = eixo.nome.toLowerCase();

      if (nomesIconesExistentes.has(nomeEixo)) {
        duplicados.push(eixo.nome);
        continue;
      }

      let icone = await this.iconeRepository.findOne({
        where: { nomeIcone: eixo.nome },
      });

      if (!icone) {
        icone = await this.iconeRepository.save(
          this.iconeRepository.create({
            nomeIcone: eixo.nome,
            descricaoIcone: eixo.descricao,
            codigoIcone: eixo.codigo,
          }),
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

      nomesIconesExistentes.add(nomeEixo);
    }

    if (adicionados.length > 0) {
      await this.interacaoService.incrementarContador(idUsuario, adicionados.length * 5);
    }

    return { adicionados, duplicados };
  }

  async listarIconesDoUsuario(idUsuario: number): Promise<PossuiIcone[]> {
    return this.possuiIconeRepository.find({
      where: { usuario: { idUsuario } },
      relations: ['icone'],
      order: { dataConquistaIcone: 'DESC' },
    });
  }

  private agruparPorEixo(materias: any[]): { nome: string; descricao: string; codigo: string }[] {
    const eixosMap = new Map<string, { nome: string; descricao: string; codigo: string }>();

    for (const materia of materias) {
      const eixoNome = this.extrairEixoDaMateria(materia.nome || materia.codigo);
      const codigoIcone = this.gerarCodigoIcone(eixoNome);

      if (!eixosMap.has(eixoNome.toLowerCase())) {
        eixosMap.set(eixoNome.toLowerCase(), {
          nome: eixoNome,
          descricao: eixoNome,
          codigo: codigoIcone,
        });
      }
    }

    return Array.from(eixosMap.values());
  }

  private extrairEixoDaMateria(nomeMateria: string): string {
    const mapeamento: Record<string, string> = {
      'cálculo': 'Matemática',
      'álgebra': 'Matemática',
      'física': 'Física',
      'química': 'Química',
      'biologia': 'Biologia',
      'programação': 'Computação',
      'banco de dados': 'Computação',
    };

    const nomeLower = nomeMateria.toLowerCase();
    for (const [chave, eixo] of Object.entries(mapeamento)) {
      if (nomeLower.includes(chave)) {
        return eixo;
      }
    }

    return nomeMateria;
  }

  private gerarCodigoIcone(eixoNome: string): string {
    const prefixo = eixoNome.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${prefixo}-${timestamp}`;
  }
}
