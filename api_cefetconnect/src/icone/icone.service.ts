import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Icone } from './entities/icone.entity';
import { ErrorMessages } from '../common/constants/messages.errors.js';
import { PossuiIcone } from './entities/possui-icone.entity';
import { Usuario } from '../entities/usuario.entity';
import { GradmentService } from '../gradment/gradment.service';
import { InteracaoService } from '../interacao/interacao.service';

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
      select: { idUsuario: true, email: true, nomeUsuario: true },
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    // Verifica se tem token de integração (conta linkada com Gradment)
    if (!usuario.tokenIntegracao) {
      throw new BadRequestException(ErrorMessages.EICO00001.mensagem);
    }

    // Busca os eixos/matérias aprovadas do usuário no Gradment
    // Usa o token de integração no header X-Integration-Token
    const eixosCompletados = await this.gradmentService.obterEixosCompletados(
      usuario.tokenIntegracao
    );

    if (!eixosCompletados || eixosCompletados.length === 0) {
      return {
        adicionados: [],
        duplicados: [],
        erro: 'Nenhum eixo completado encontrado no Gradment.',
      };
    }

    // 5. Busca ícones já existentes do usuário
    const iconesExistentes = await this.possuiIconeRepository.find({
      where: { usuario: { idUsuario } },
      relations: ['icone'],
    });
    const nomesIconesExistentes = new Set(
      iconesExistentes.map((pi) => pi.icone.nomeIcone.toLowerCase())
    );

    const adicionados: IconeImportadoDto[] = [];
    const duplicados: string[] = [];

    // Processa cada eixo completado
    // Agrupa matérias por eixo (categoria) - isso deve vir do Gradment
    const eixosUnicos = this.agruparPorEixo(eixosCompletados);

    for (const eixo of eixosUnicos) {
      const nomeEixo = eixo.nome.toLowerCase();

      if (nomesIconesExistentes.has(nomeEixo)) {
        duplicados.push(eixo.nome);
        continue;
      }

      // Cria ou encontra o ícone
      let icone = await this.iconeRepository.findOne({
        where: { nomeIcone: eixo.nome },
      });

      if (!icone) {
        icone = await this.iconeRepository.save(
          this.iconeRepository.create({
            nomeIcone: eixo.nome,
            descricaoIcone: eixo.descricao,
            codigoIcone: eixo.codigo,
          })
        );
      }

      // Associa o ícone ao usuário
      const possuiIcone = await this.possuiIconeRepository.save(
        this.possuiIconeRepository.create({
          icone,
          usuario,
        })
      );

      adicionados.push({
        idIcone: icone.idIcone,
        nomeIcone: icone.nomeIcone,
        descricaoIcone: icone.descricaoIcone,
        codigoIcone: icone.codigoIcone,
      });

      nomesIconesExistentes.add(nomeEixo);
    }

    // 7. Incrementa contador de interação (+5 por cada ícone importado)
    if (adicionados.length > 0) {
      await this.interacaoService.incrementarContador(idUsuario, adicionados.length * 5);
    }

    return {
      adicionados,
      duplicados,
    };
  }

  /**
   * Agrupa matérias por eixo (categoria)
   * Isso é um placeholder - a estrutura real virá do Gradment
   */
  private agruparPorEixo(materias: any[]): { nome: string; descricao: string; codigo: string }[] {
    // TODO: Ajustar conforme a API real do Gradment
    // Por enquanto, usamos as categorias das matérias
    const eixosMap = new Map<string, { nome: string; descricao: string; codigo: string }>();

    for (const materia of materias) {
      // Extrai o eixo da matéria (isso deve vir do Gradment)
      const eixoNome = this.extrairEixoDaMateria(materia.nome || materia.codigo);

      const codigoIcone = this.gerarCodigoIcone(eixoNome);
      
      if (!eixosMap.has(eixoNome.toLowerCase())) {
        eixosMap.set(eixoNome.toLowerCase(), {
          nome: eixoNome,
          descricao: eixoNome, // A descrição é o próprio nome do eixo
          codigo: codigoIcone,
        });
      }
    }

    return Array.from(eixosMap.values());
  }

  /**
   * Extrai o nome do eixo a partir do nome da matéria
   * Placeholder - a lógica real deve vir do Gradment
   */
  private extrairEixoDaMateria(nomeMateria: string): string {
    // TODO: Ajustar conforme a estrutura real do Gradment
    // Exemplos de mapeamento:
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

    // Se não encontrou, retorna o próprio nome da matéria
    return nomeMateria;
  }

  /**
   * Gera um código único para o ícone baseado no nome do eixo
   */
  private gerarCodigoIcone(eixoNome: string): string {
    // TODO: Ajustar conforme necessidade
    // Por enquanto, gera um código baseado nas 3 primeiras letras + timestamp
    const prefixo = eixoNome.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-4);
    return `${prefixo}-${timestamp}`;
  }

  /**
   * Lista todos os ícones de um usuário
   */
  async listarIconesDoUsuario(idUsuario: number): Promise<PossuiIcone[]> {
    return this.possuiIconeRepository.find({
      where: { usuario: { idUsuario } },
      relations: ['icone'],
      order: { dataConquistaIcone: 'DESC' },
    });
  }
}
