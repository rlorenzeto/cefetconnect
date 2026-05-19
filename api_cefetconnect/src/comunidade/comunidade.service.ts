import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { CreateComunidadeDto } from './dto/create-comunidade.dto';
import { UpdateComunidadeDto } from './dto/update-comunidade.dto';
import { Usuario } from '../entities/usuario.entity';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ErrorMessages } from '../common/constants/messages.errors';
import { Comunidade } from '../entities/comunidade.entity';

@Injectable()
export class ComunidadeService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Comunidade)
    private comunidadeRepository: Repository<Comunidade>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}
    
  async create(createComunidadeDto: CreateComunidadeDto, matricula: string) {
    const criadorComunidade = await this.usuarioRepository.findOne({
      where: { matricula },
      select: { matricula: true, nomeUsuario: true },
    });

    if (!criadorComunidade) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    const novaComunidade = this.comunidadeRepository.create({
      nomeComunidade: createComunidadeDto.nome,
      descricaoComunidade: createComunidadeDto.descricao,
      criador: criadorComunidade,
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
        criador: { nomeUsuario: true },
      },
    });
  }

  async update(id: string, updateComunidadeDto: UpdateComunidadeDto, matricula: string) {
    const comunidade = await this.comunidadeRepository.findOne({
      where: { idComunidade: id },
      relations: ['criador'],
      select: {
        idComunidade: true,
        nomeComunidade: true,
        descricaoComunidade: true,
        criador: { matricula: true, nomeUsuario: true },
      },
    });

    if (!comunidade) {
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    if (comunidade.criador?.matricula !== matricula) {
      throw new ForbiddenException(ErrorMessages.ECOM00002.mensagem);
    }

    if (updateComunidadeDto.nome !== undefined) {
      comunidade.nomeComunidade = updateComunidadeDto.nome;
    }

    if (updateComunidadeDto.descricao !== undefined) {
      comunidade.descricaoComunidade = updateComunidadeDto.descricao;
    }

    return await this.comunidadeRepository.save(comunidade);
  }

  async remove(id: string, matricula: string) {
    const comunidade = await this.comunidadeRepository.findOne({
      where: { idComunidade: id },
      relations: ['criador'],
    });

    if (!comunidade) {
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    if (comunidade.criador?.matricula !== matricula) {
      throw new ForbiddenException(ErrorMessages.ECOM00002.mensagem);
    }

    return await this.comunidadeRepository.remove(comunidade);
  }

  async entrar(idComunidade: string, matricula: string) {
    const comunidade = await this.comunidadeRepository.findOne({
      where: { idComunidade },
    });

    if (!comunidade) {
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { matricula },
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    const membroExistente: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM participa WHERE usuarioMatricula = ? AND comunidadeIdComunidade = ?',
      [matricula, idComunidade],
    );

    if (membroExistente.length > 0) {
      throw new ConflictException(ErrorMessages.ECOM00004.mensagem);
    }

    await this.dataSource.query(
      'INSERT INTO participa (usuarioMatricula, comunidadeIdComunidade) VALUES (?, ?)',
      [matricula, idComunidade],
    );

    return { entrou: true, idComunidade };
  }

  async sair(idComunidade: string, matricula: string) {
    const comunidade = await this.comunidadeRepository.findOne({
      where: { idComunidade },
    });

    if (!comunidade) {
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    const membroExistente: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM participa WHERE usuarioMatricula = ? AND comunidadeIdComunidade = ?',
      [matricula, idComunidade],
    );

    if (membroExistente.length === 0) {
      throw new NotFoundException(ErrorMessages.ECOM00005.mensagem);
    }

    await this.dataSource.query(
      'DELETE FROM participa WHERE usuarioMatricula = ? AND comunidadeIdComunidade = ?',
      [matricula, idComunidade],
    );

    return { saiu: true, idComunidade };
  }
}
