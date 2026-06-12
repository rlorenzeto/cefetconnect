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
import { InteracaoService } from '../interacao/interacao.service';

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
    private interacaoService: InteracaoService,
  ) {}

  async create(idPost: string, idUsuario: number, createComentarioDto: CreateComentarioDto) {
    const [post, usuario] = await Promise.all([
      this.postRepository.findOne({ where: { idPost } }), // Vai no banco procurar o post onde o aluno quer comentar
      this.usuarioRepository.findOne({
        where: { idUsuario },
        select: { idUsuario: true, nomeUsuario: true, fotoUrl: true },
      }),
    ]);

    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }
    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    const comentario = this.comentarioRepository.create({
      texto: createComentarioDto.texto,
      post,
      usuario,
      dataHora: new Date(),
    });

    const comentarioSalvo = await this.comentarioRepository.save(comentario);

    // Verifica se é o primeiro comentário do usuário neste post
    const comentariosDoUsuarioNoPost = await this.comentarioRepository.count({
      where: {
        post: { idPost: post.idPost },
        usuario: { idUsuario: idUsuario },
      },
    });
    if (comentariosDoUsuarioNoPost === 1) {
      await this.interacaoService.incrementarContador(idUsuario, 1);
    }

    return comentarioSalvo;
  }

  // Função responsável por retornar os comentários quando estamos vendo um post.
  async findByPost(idPost: string) {
    const post = await this.postRepository.findOne({ where: { idPost } });
    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    return await this.comentarioRepository
      .createQueryBuilder('comentario')
      .where('comentario.fk_Post_idPost = :idPost', { idPost }) // traga apenas comentários desse post específico.
      .leftJoinAndSelect('comentario.usuario', 'usuario') // junte as informações do usuário que fez o comentário
      .select([
        'comentario.idComentario',
        'comentario.texto',
        'comentario.dataHora',
        'usuario.idUsuario',
        'usuario.nomeUsuario',
        'usuario.fotoUrl',
      ])
      .orderBy('comentario.dataHora', 'ASC') // ordene os comentários pela data de criação, do mais antigo ao mais novo.
      .getMany();
  }

  // Busca um comentário específico pelo ID dele.
  async findOne(id: string) {
    const comentario = await this.comentarioRepository.findOne({
      where: { idComentario: id },
      relations: ['usuario', 'post'], // traz quem fez e o post ao qual o comentário pertence
      select: { // me entrega apenas esses campos
        idComentario: true,
        texto: true,
        dataHora: true,
        usuario: { idUsuario: true, nomeUsuario: true, fotoUrl: true },
        post: { idPost: true }, // entra apenas o ID do post
      },
    });

    if (!comentario) { // se não encontrou o comentário
      throw new NotFoundException(ErrorMessages.EUSR00020.mensagem);
    }

    return comentario;
  }

  async update(id: string, idUsuario: number, updateComentarioDto: UpdateComentarioDto) {
    const comentario = await this.comentarioRepository.findOne({
      where: { idComentario: id },
      relations: ['usuario'],
    });

    if (!comentario) {
      throw new NotFoundException(ErrorMessages.EUSR00020.mensagem);
    }

    if (comentario.usuario.idUsuario !== idUsuario) {
      throw new ForbiddenException(ErrorMessages.EUSR00013.mensagem);
    }

    if (updateComentarioDto.texto !== undefined) {
      comentario.texto = updateComentarioDto.texto;
    }

    return await this.comentarioRepository.save(comentario);
  }

  async remove(id: string, idUsuario: number) {
    const comentario = await this.comentarioRepository.findOne({
      where: { idComentario: id },
      relations: ['usuario', 'post'],
    });

    if (!comentario) {
      throw new NotFoundException(ErrorMessages.EUSR00020.mensagem);
    }

    if (comentario.usuario.idUsuario !== idUsuario) {
      throw new ForbiddenException(ErrorMessages.EUSR00013.mensagem);
    }

    // Conta quantos comentários o usuário tem neste post (incluindo o atual)
    const totalComentariosNoPost = await this.comentarioRepository.count({
      where: {
        post: { idPost: comentario.post.idPost },
        usuario: { idUsuario: idUsuario },
      },
    });
    if (totalComentariosNoPost === 1) {
      await this.interacaoService.decrementarContador(idUsuario, 1);
    }

    return await this.comentarioRepository.remove(comentario);
  }

  // Curtidas 

  async curtirComentario(idComentario: string, idUsuario: number) {
    const comentario = await this.comentarioRepository.findOne({
      where: { idComentario },
    });
    if (!comentario) {
      throw new NotFoundException(ErrorMessages.EUSR00020.mensagem);
    }

    // Verifica se o usuário já curtiu o comentário, retorna 1 se existir
    const existing: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM likeComentario WHERE usuarioIdUsuario = ? AND comentarioIdComentario = ?',
      [idUsuario, idComentario],
    );

    // Se já curtiu, lança exceção
    if (existing.length > 0) {
      throw new ConflictException(ErrorMessages.EUSR00021.mensagem);
    }

    // Busca o comentário para obter o ID do post
    const comentarioComPost = await this.comentarioRepository.findOne({
      where: { idComentario },
      relations: ['post'],
    });

    // Conta quantas curtidas o usuário já deu em comentários deste post
    const curtidasNoPost: { total: number }[] = await this.dataSource.query(
      `SELECT COUNT(*) as total FROM likeComentario lc
       INNER JOIN Comentario c ON c.idComentario = lc.comentarioIdComentario
       WHERE lc.usuarioIdUsuario = ? AND c.fk_Post_idPost = ?`,
      [idUsuario, comentarioComPost?.post?.idPost],
    );

    // Insere a curtida
    await this.dataSource.query(
      'INSERT INTO likeComentario (usuarioIdUsuario, comentarioIdComentario) VALUES (?, ?)',
      [idUsuario, idComentario],
    );

    // Incrementa contador apenas na primeira curtida de comentário do usuário no post
    if (!curtidasNoPost[0] || curtidasNoPost[0].total === 0) {
      await this.interacaoService.incrementarContador(idUsuario, 1);
    }

    return { curtido: true };
  }

  async descurtirComentario(idComentario: string, idUsuario: number) {
    const comentario = await this.comentarioRepository.findOne({
      where: { idComentario },
    });
    if (!comentario) {
      throw new NotFoundException(ErrorMessages.EUSR00020.mensagem);
    }

    const existing: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM likeComentario WHERE usuarioIdUsuario = ? AND comentarioIdComentario = ?',
      [idUsuario, idComentario],
    );

    if (existing.length === 0) {
      throw new NotFoundException(ErrorMessages.EUSR00022.mensagem);
    }

    // Busca o comentário para obter o ID do post
    const comentarioComPostDes = await this.comentarioRepository.findOne({
      where: { idComentario },
      relations: ['post'],
    });

    // Conta quantas curtidas o usuário tem em comentários deste post (antes de deletar)
    const curtidasNoPostAntes: { total: number }[] = await this.dataSource.query(
      `SELECT COUNT(*) as total FROM likeComentario lc
       INNER JOIN Comentario c ON c.idComentario = lc.comentarioIdComentario
       WHERE lc.usuarioIdUsuario = ? AND c.fk_Post_idPost = ?`,
      [idUsuario, comentarioComPostDes?.post?.idPost],
    );

    await this.dataSource.query(
      'DELETE FROM likeComentario WHERE usuarioIdUsuario = ? AND comentarioIdComentario = ?',
      [idUsuario, idComentario],
    );

    // Decrementa contador apenas se era a única curtida de comentário do usuário no post
    if (curtidasNoPostAntes[0]?.total === 1) {
      await this.interacaoService.decrementarContador(idUsuario, 1);
    }

    return { curtido: false };
  }

  async contarCurtidasComentario(idComentario: string) {
    const comentario = await this.comentarioRepository.findOne({
      where: { idComentario },
    });

    if (!comentario) {
      throw new NotFoundException(ErrorMessages.EUSR00020.mensagem);
    }

    const usuarios: {
      idUsuario: number;
      nomeUsuario: string;
      fotoUrl: string | null;
    }[] = await this.dataSource.query(
      `SELECT 
        u.idUsuario AS idUsuario,
        u.nomeUsuario AS nomeUsuario,
        u.fotoUrl AS fotoUrl
      FROM likeComentario lc
      INNER JOIN Usuario u ON u.idUsuario = lc.usuarioIdUsuario
      WHERE lc.comentarioIdComentario = ?
      ORDER BY u.nomeUsuario ASC`,
      [idComentario],
    );

    return {
      idComentario,
      totalCurtidas: usuarios.length,
      usuarios,
    };
  }
}
