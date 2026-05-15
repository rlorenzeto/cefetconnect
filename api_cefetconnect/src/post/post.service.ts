import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from '../entities/post.entity';
import { Usuario } from '../entities/usuario.entity';
import { FotoPost } from '../entities/foto-post.entity';
import { Comentario } from '../entities/comentario.entity';
import { ErrorMessages } from '../common/constants/messages.errors';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(FotoPost)
    private fotoPostRepository: Repository<FotoPost>,
    @InjectRepository(Comentario)
    private comentarioRepository: Repository<Comentario>,
    @InjectDataSource() //executar queries SQL manuais
    private dataSource: DataSource,
  ) {}

  async create(createPostDto: CreatePostDto, matricula: string, files?: Express.Multer.File[]) {
    const autor = await this.usuarioRepository.findOne({
      where: { matricula },
      select: { matricula: true, nomeUsuario: true },
    });

    if (!autor) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    const criarPost = this.postRepository.create({
      conteudo: createPostDto.conteudo,
      usuario: autor,
      dataHoraPublicacao: new Date(),
    });

    const postCriado = await this.postRepository.save(criarPost);

    if (files && files.length > 0) {
      const fotos = files.map((file, index) =>
        this.fotoPostRepository.create({ url: file.path.replace(/\\/g, '/'), ordem: index, post: postCriado }),
      );
      const fotosSalvas = await this.fotoPostRepository.save(fotos);
      postCriado.fotosPost = fotosSalvas;
    }

    return postCriado;
  }

  // Leitura 

  async findAll() {
    return await this.postRepository.find({
      relations: ['usuario', 'fotosPost'],
      select: {
        idPost: true,
        conteudo: true,
        dataHoraPublicacao: true,
        usuario: { matricula: true, nomeUsuario: true },
        fotosPost: true,
      },
    });
  }

  async findOne(id: string) {
    const post = await this.postRepository.findOne({
      where: { idPost: id },
      relations: ['usuario', 'fotosPost', 'comentarios', 'comentarios.usuario'],
      select: {
        idPost: true,
        conteudo: true,
        dataHoraPublicacao: true,
        usuario: { matricula: true, nomeUsuario: true },
        fotosPost: true,
      },
    });

    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    return post;
  }

  async findByUsuario(matricula: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { matricula },
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    return this.postRepository
      .createQueryBuilder('post')
      .where('post.fk_Usuario_matricula = :matricula', { matricula })
      .leftJoinAndSelect('post.usuario', 'usuario')
      .leftJoinAndSelect('post.fotosPost', 'foto')
      .select([
        'post.idPost',
        'post.conteudo',
        'post.dataHoraPublicacao',
        'usuario.matricula',
        'usuario.nomeUsuario',
        'foto.idFoto',
        'foto.url',
        'foto.ordem',
      ])
      .getMany();
  }

  // Atualização / Exclusão 

  async update(id: string, matricula: string, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: { idPost: id },
      relations: ['usuario'],
      select: {
        idPost: true,
        conteudo: true,
        dataHoraPublicacao: true,
        usuario: { matricula: true, nomeUsuario: true },
      },
    });

    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    if (post.usuario.matricula !== matricula) {
      throw new ForbiddenException(ErrorMessages.EUSR00013.mensagem);
    }

    if (updatePostDto.conteudo !== undefined) {
      post.conteudo = updatePostDto.conteudo;
    }

    return await this.postRepository.save(post);
  }

  async remove(id: string, matricula: string) {
    const post = await this.postRepository.findOne({
      where: { idPost: id },
      relations: ['usuario', 'fotosPost'],
    });

    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    if (post.usuario.matricula !== matricula) {
      throw new ForbiddenException(ErrorMessages.EUSR00013.mensagem);
    }

    if (post.fotosPost && post.fotosPost.length > 0) {
      await this.fotoPostRepository.remove(post.fotosPost);
    }

    return await this.postRepository.remove(post);
  }

  // Fotos 

  async adicionarFotos(idPost: string, matricula: string, files: Express.Multer.File[]) {
    const post = await this.postRepository.findOne({
      where: { idPost },
      relations: ['usuario', 'fotosPost'],
      select: { 
        idPost: true,
        conteudo: true,
        dataHoraPublicacao: true,
        usuario: { matricula: true, nomeUsuario: true },
        fotosPost: true,
      },
    });

    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    if (post.usuario.matricula !== matricula) {
      throw new ForbiddenException(ErrorMessages.EUSR00013.mensagem);
    }

    const ordemBase = (post.fotosPost ?? []).length;
    const novasFotos = files.map((file, index) =>
      this.fotoPostRepository.create({ url: file.path.replace(/\\/g, '/'), ordem: ordemBase + index, post }),
    );

    const fotosAdicionadas = await this.fotoPostRepository.save(novasFotos);
    post.fotosPost = [...(post.fotosPost ?? []), ...fotosAdicionadas];

    return post;
  }

  async removerFotos(idPost: string, matricula: string, ids?: string[]) {
    const post = await this.postRepository.findOne({
      where: { idPost },
      relations: ['usuario', 'fotosPost'],
    });

    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    if (post.usuario.matricula !== matricula) {
      throw new ForbiddenException(ErrorMessages.EUSR00013.mensagem);
    }

    const todasFotos = post.fotosPost ?? [];

    const fotosParaRemover =
      ids && ids.length > 0
        ? todasFotos.filter((f) => ids.includes(f.idFoto))
        : todasFotos;

    if (fotosParaRemover.length === 0) {
      return { removidas: 0 };
    }

    await this.fotoPostRepository.remove(fotosParaRemover);
    return { removidas: fotosParaRemover.length };
  }

  async obterFotosPost(idPost: string) {
    const post = await this.postRepository.findOne({
      where: { idPost },
      relations: ['fotosPost'],
    });

    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    return post.fotosPost ?? [];
  }

  // Curtidas 

  async obterCurtidasPost(idPost: string) {
    const post = await this.postRepository.findOne({ where: { idPost } });
    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    const curtidas: { matricula: string; nomeUsuario: string }[] =
      await this.dataSource.query(
        `SELECT u.matricula, u.nomeUsuario
         FROM likePost lp
         INNER JOIN Usuario u ON u.matricula = lp.usuarioMatricula
         WHERE lp.postIdPost = ?`,
        [idPost],
      );

    return { total: curtidas.length, usuarios: curtidas };
  }

  async curtirPost(idPost: string, matricula: string) {
    const post = await this.postRepository.findOne({ where: { idPost } });
    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    const existing: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM likePost WHERE usuarioMatricula = ? AND postIdPost = ?',
      [matricula, idPost],
    );

    if (existing.length > 0) {
      throw new ConflictException(ErrorMessages.EUSR00018.mensagem);
    }

    await this.dataSource.query(
      'INSERT INTO likePost (usuarioMatricula, postIdPost) VALUES (?, ?)',
      [matricula, idPost],
    );

    return { curtido: true };
  }

  async descurtirPost(idPost: string, matricula: string) {
    const post = await this.postRepository.findOne({ where: { idPost } });
    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    const existing: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM likePost WHERE usuarioMatricula = ? AND postIdPost = ?',
      [matricula, idPost],
    );

    if (existing.length === 0) {
      throw new NotFoundException(ErrorMessages.EUSR00019.mensagem);
    }

    await this.dataSource.query(
      'DELETE FROM likePost WHERE usuarioMatricula = ? AND postIdPost = ?',
      [matricula, idPost],
    );

    return { curtido: false };
  }

  async contarLikesDadosPorUsuario(matricula: string) {
    const usuario = await this.usuarioRepository.findOne({
      where: { matricula },
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    const [totalRow]: [{ total: string }] = await this.dataSource.query(
      `SELECT COUNT(*) AS total
       FROM likePost lp
       JOIN Post p ON lp.postIdPost = p.idPost
       WHERE lp.usuarioMatricula = ?
         AND p.fk_Usuario_matricula != ?`,
      [matricula, matricula],
    );

    return { totalCurtidasEmPostsDeOutros: parseInt(totalRow.total, 10) };
  }

  // Comentários 

  async comentarPost(idPost: string, matricula: string, texto: string) {
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

    const comentario = this.comentarioRepository.create({ texto, post, usuario, dataHora: new Date() });
    return await this.comentarioRepository.save(comentario);
  }

  async removerComentario(idComentario: string, matricula: string) {
    const comentario = await this.comentarioRepository.findOne({
      where: { idComentario },
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
}
