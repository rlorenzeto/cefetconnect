import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { CreateComunidadeDto } from './dto/create-comunidade.dto';
import { UpdateComunidadeDto } from './dto/update-comunidade.dto';
import { Usuario } from '../entities/usuario.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ErrorMessages } from '../common/constants/messages.errors';
import { Comunidade } from '../entities/comunidade.entity';
import { GradmentService } from '../gradment/gradment.service';

@Injectable()
export class ComunidadeService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Comunidade)
    private comunidadeRepository: Repository<Comunidade>,
    @InjectDataSource()
    private dataSource: DataSource,
    private gradmentService: GradmentService,
  ) {}
    
  async create(
    createComunidadeDto: CreateComunidadeDto,
    idUsuario: number,
    capaFile?: Express.Multer.File,
    fotoFile?: Express.Multer.File,
  ) {
    const criadorComunidade = await this.usuarioRepository.findOne({
      where: { idUsuario },
      select: { idUsuario: true, nomeUsuario: true },
    });

    if (!criadorComunidade) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    const novaComunidade = this.comunidadeRepository.create({
      nomeComunidade: createComunidadeDto.nomeComunidade,
      descricaoComunidade: createComunidadeDto.descricaoComunidade,
      criador: criadorComunidade,
      capaComunidade: capaFile ? capaFile.path.replace(/\\/g, '/') : null,
      fotoUrlComunidade: fotoFile ? fotoFile.path.replace(/\\/g, '/') : null,
      gradmentDisciplinaId: createComunidadeDto.gradmentDisciplinaId ?? null,
    });

    return await this.comunidadeRepository.save(novaComunidade);
  }

  async findAll() {
    return await this.comunidadeRepository.find({
      relations: ['criador'],
      select: { 
        idComunidade: true,
        nomeComunidade: true,
        descricaoComunidade: true,
        capaComunidade: true,
        fotoUrlComunidade: true,
        gradmentDisciplinaId: true,
        criador: { nomeUsuario: true },
      },
    });
  }

  async findMinhasDisciplinas(email: string) {
    const dadosGradment = await this.gradmentService.buscarDadosUsuario(email);
    if (!dadosGradment) return [];

    return await this.gradmentService.obterMateriasAprovadas(
      dadosGradment.usuario.id,
      dadosGradment.sessionToken,
    );
  }

  async findPorDisciplina(disciplinaId: number) {
    return await this.comunidadeRepository.find({
      where: { gradmentDisciplinaId: disciplinaId },
      relations: ['criador'],
      select: {
        idComunidade: true,
        nomeComunidade: true,
        descricaoComunidade: true,
        capaComunidade: true,
        fotoUrlComunidade: true,
        gradmentDisciplinaId: true,
        criador: { nomeUsuario: true },
      },
    });
  }

  async findOne(id: string) {
    return await this.comunidadeRepository.findOne({
      where: { idComunidade: id },
      relations: ['criador'],
      select: { 
        idComunidade: true,
        nomeComunidade: true,
        descricaoComunidade: true,
        capaComunidade: true,
        fotoUrlComunidade: true,
        criador: { nomeUsuario: true },
      },
    });
  }

  async update(
    id: string,
    updateComunidadeDto: UpdateComunidadeDto,
    idUsuario: number,
    capaFile?: Express.Multer.File,
    fotoFile?: Express.Multer.File,
  ) {
    const comunidade = await this.comunidadeRepository.findOne({
      where: { idComunidade: id },
      relations: ['criador'],
      select: {
        idComunidade: true,
        nomeComunidade: true,
        descricaoComunidade: true,
        capaComunidade: true,
        fotoUrlComunidade: true,
        criador: { idUsuario: true, nomeUsuario: true },
      },
    });

    if (!comunidade) {
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    if (comunidade.criador?.idUsuario !== idUsuario) {
      throw new ForbiddenException(ErrorMessages.ECOM00002.mensagem);
    }

    if (updateComunidadeDto.nomeComunidade !== undefined) {
      comunidade.nomeComunidade = updateComunidadeDto.nomeComunidade;
    }

    if (updateComunidadeDto.descricaoComunidade !== undefined) {
      comunidade.descricaoComunidade = updateComunidadeDto.descricaoComunidade;
    }

    if (capaFile) {
      if (comunidade.capaComunidade) {
        const caminhoAntigo = join(process.cwd(), comunidade.capaComunidade);
        await unlink(caminhoAntigo).catch(() => {});
      }
      comunidade.capaComunidade = capaFile.path.replace(/\\/g, '/');
    }

    if (fotoFile) {
      if (comunidade.fotoUrlComunidade) {
        const caminhoAntigo = join(process.cwd(), comunidade.fotoUrlComunidade);
        await unlink(caminhoAntigo).catch(() => {});
      }
      comunidade.fotoUrlComunidade = fotoFile.path.replace(/\\/g, '/');
    }

    return await this.comunidadeRepository.save(comunidade);
  }

  async remove(id: string, idUsuario: number) {
    const comunidade = await this.comunidadeRepository.findOne({
      where: { idComunidade: id },
      relations: ['criador'],
    });

    if (!comunidade) {
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    if (comunidade.criador?.idUsuario !== idUsuario) {
      throw new ForbiddenException(ErrorMessages.ECOM00002.mensagem);
    }

    return await this.comunidadeRepository.remove(comunidade);
  }

  async entrar(idComunidade: string, idUsuario: number) {
    const comunidade = await this.comunidadeRepository.findOne({
      where: { idComunidade },
    });

    if (!comunidade) {
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    const membroExistente: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM participa WHERE usuarioIdUsuario = ? AND comunidadeIdComunidade = ?',
      [idUsuario, idComunidade],
    );

    if (membroExistente.length > 0) {
      throw new ConflictException(ErrorMessages.ECOM00004.mensagem);
    }

    await this.dataSource.query(
      'INSERT INTO participa (usuarioIdUsuario, comunidadeIdComunidade) VALUES (?, ?)',
      [idUsuario, idComunidade],
    );

    return { entrou: true, idComunidade };
  }

  async findEventos(idComunidade: string) {
    const comunidade = await this.comunidadeRepository.findOne({
      where: { idComunidade },
      relations: ['eventos', 'eventos.usuario'],
      select: {
        idComunidade: true,
        eventos: {
          idEvento: true,
          titulo: true,
          descricaoEvento: true,
          localEvento: true,
          status: true,
          dataEvento: true,
          capaEvento: true,
          usuario: { nomeUsuario: true },
        },
      },
    });

    if (!comunidade) throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    return comunidade.eventos ?? [];
  }

  async sair(idComunidade: string, idUsuario: number) {
    const comunidade = await this.comunidadeRepository.findOne({
      where: { idComunidade },
    });

    if (!comunidade) {
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    const membroExistente: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM participa WHERE usuarioIdUsuario = ? AND comunidadeIdComunidade = ?',
      [idUsuario, idComunidade],
    );

    if (membroExistente.length === 0) {
      throw new NotFoundException(ErrorMessages.ECOM00005.mensagem);
    }

    await this.dataSource.query(
      'DELETE FROM participa WHERE usuarioIdUsuario = ? AND comunidadeIdComunidade = ?',
      [idUsuario, idComunidade],
    );

    return { saiu: true, idComunidade };
  }
}
