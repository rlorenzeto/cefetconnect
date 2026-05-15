import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { Comentario } from '../entities/comentario.entity';
import { Post } from '../entities/post.entity';
import { Usuario } from '../entities/usuario.entity';
import { ErrorMessages } from '../common/constants/messages.errors';

@Injectable()
export class ComentarioService {
  constructor(
    @InjectRepository(Comentario)
    private comentarioRepository: Repository<Comentario>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(idPost: string, matricula: string, createComentarioDto: CreateComentarioDto) {
    const post = await this.postRepository.findOne({ where: { idPost } });
    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { matricula },
      select: { matricula: true, nomeUsuario: true },
    });
    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    const comentario = this.comentarioRepository.create({
      texto: createComentarioDto.texto,
      post,
      usuario,
      dataHora: new Date(),
    });

    return await this.comentarioRepository.save(comentario);
  }

  async findByPost(idPost: string) {
    const post = await this.postRepository.findOne({ where: { idPost } });
    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    return await this.comentarioRepository
      .createQueryBuilder('comentario')
      .where('comentario.fk_Post_idPost = :idPost', { idPost })
      .leftJoinAndSelect('comentario.usuario', 'usuario')
      .select([
        'comentario.idComentario',
        'comentario.texto',
        'comentario.dataHora',
        'usuario.matricula',
        'usuario.nomeUsuario',
      ])
      .orderBy('comentario.dataHora', 'ASC')
      .getMany();
  }

  async findOne(id: string) {
    const comentario = await this.comentarioRepository.findOne({
      where: { idComentario: id },
      relations: ['usuario', 'post'],
      select: {
        idComentario: true,
        texto: true,
        dataHora: true,
        usuario: { matricula: true, nomeUsuario: true },
        post: { idPost: true },
      },
    });

    if (!comentario) {
      throw new NotFoundException(ErrorMessages.EUSR00020.mensagem);
    }

    return comentario;
  }

  async update(id: string, matricula: string, updateComentarioDto: UpdateComentarioDto) {
    const comentario = await this.comentarioRepository.findOne({
      where: { idComentario: id },
      relations: ['usuario'],
    });

    if (!comentario) {
      throw new NotFoundException(ErrorMessages.EUSR00020.mensagem);
    }

    if (comentario.usuario.matricula !== matricula) {
      throw new ForbiddenException(ErrorMessages.EUSR00013.mensagem);
    }

    if (updateComentarioDto.texto !== undefined) {
      comentario.texto = updateComentarioDto.texto;
    }

    return await this.comentarioRepository.save(comentario);
  }

  async remove(id: string, matricula: string) {
    const comentario = await this.comentarioRepository.findOne({
      where: { idComentario: id },
      relations: ['usuario'],
    });

    if (!comentario) {
      throw new NotFoundException(ErrorMessages.EUSR00020.mensagem);
    }

    if (comentario.usuario.matricula !== matricula) {
      throw new ForbiddenException(ErrorMessages.EUSR00013.mensagem);
    }

    return await this.comentarioRepository.remove(comentario);
  }

  // Curtidas 

  async curtirComentario(idComentario: string, matricula: string) {
    const comentario = await this.comentarioRepository.findOne({
      where: { idComentario },
    });
    if (!comentario) {
      throw new NotFoundException(ErrorMessages.EUSR00020.mensagem);
    }

    const existing: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM likeComentario WHERE usuarioMatricula = ? AND comentarioIdComentario = ?',
      [matricula, idComentario],
    );

    if (existing.length > 0) {
      throw new ConflictException(ErrorMessages.EUSR00021.mensagem);
    }

    await this.dataSource.query(
      'INSERT INTO likeComentario (usuarioMatricula, comentarioIdComentario) VALUES (?, ?)',
      [matricula, idComentario],
    );

    return { curtido: true };
  }

  async descurtirComentario(idComentario: string, matricula: string) {
    const comentario = await this.comentarioRepository.findOne({
      where: { idComentario },
    });
    if (!comentario) {
      throw new NotFoundException(ErrorMessages.EUSR00020.mensagem);
    }

    const existing: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM likeComentario WHERE usuarioMatricula = ? AND comentarioIdComentario = ?',
      [matricula, idComentario],
    );

    if (existing.length === 0) {
      throw new NotFoundException(ErrorMessages.EUSR00022.mensagem);
    }

    await this.dataSource.query(
      'DELETE FROM likeComentario WHERE usuarioMatricula = ? AND comentarioIdComentario = ?',
      [matricula, idComentario],
    );

    return { curtido: false };
  }

  async contarCurtidasComentario(idComentario: string) {
    const comentario = await this.comentarioRepository.findOne({
      where: { idComentario },
    });
    if (!comentario) {
      throw new NotFoundException(ErrorMessages.EUSR00020.mensagem);
    }

    const [row]: [{ total: string }] = await this.dataSource.query(
      'SELECT COUNT(*) AS total FROM likeComentario WHERE comentarioIdComentario = ?',
      [idComentario],
    );

    return { idComentario, totalCurtidas: parseInt(row.total, 10) };
  }
}
