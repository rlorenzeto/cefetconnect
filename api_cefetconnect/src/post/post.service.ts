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
import { Comunidade } from '../entities/comunidade.entity';
import { ErrorMessages } from '../common/constants/messages.errors';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(FotoPost)
    private fotoPostRepository: Repository<FotoPost>, // Fornece comandos diretos, como: save, remove, create.
    @InjectRepository(Comentario)
    private comentarioRepository: Repository<Comentario>,
    @InjectRepository(Comunidade)
    private comunidadeRepository: Repository<Comunidade>,
    @InjectDataSource() //executar queries SQL manuais
    private dataSource: DataSource,
  ) {}

  async create(createPostDto: CreatePostDto, idUsuario: number, files?: Express.Multer.File[]) {
    const autor = await this.usuarioRepository.findOne({
      where: { idUsuario: idUsuario },
      select: { idUsuario: true, nomeUsuario: true },
    });

    if (!autor) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    let comunidade: Comunidade | undefined;

    if (createPostDto.idComunidade) {
      const comunidadeEncontrada = await this.comunidadeRepository.findOne({
        where: { idComunidade: createPostDto.idComunidade },
      });

      if (!comunidadeEncontrada) {
        throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
      }

      const membro: unknown[] = await this.dataSource.query(
        'SELECT 1 FROM participa WHERE usuarioIdUsuario = ? AND comunidadeIdComunidade = ?',
        [idUsuario, createPostDto.idComunidade],
      );

      if (membro.length === 0) {
        throw new ForbiddenException(ErrorMessages.ECOM00003.mensagem);
      }

      comunidade = comunidadeEncontrada;
    }

    const criarPost = this.postRepository.create({
      conteudo: createPostDto.conteudo,
      usuario: autor,
      dataHoraPublicacao: new Date(),
      ...(comunidade && { comunidade }),
    });

    const postCriado = await this.postRepository.save(criarPost);

    if (files && files.length > 0) {
      // mapeia os arquivos para criar os registros de fotos, preservando a ordem e associando ao post criado
      const fotos = files.map((file, index) => 
        this.fotoPostRepository.create({ url: file.path.replace(/\\/g, '/'), ordem: index, post: postCriado }),
      );
      const fotosSalvas = await this.fotoPostRepository.save(fotos);
      postCriado.fotosPost = fotosSalvas;
    }

    return {
      idPost: postCriado.idPost,
      conteudo: postCriado.conteudo,
      dataHoraPublicacao: postCriado.dataHoraPublicacao,
      usuario: { nomeUsuario: postCriado.usuario?.nomeUsuario },
      fotosPost: postCriado.fotosPost ?? [],
    };
  }

  // Parte de Leitura 

  // Essa função que retorna todos os posts com suas respectivas fotos e usuários, possibilitando o feed funcionar
  async findAll() {
    return await this.postRepository.find({
      relations: ['usuario', 'fotosPost'],
      select: {
        idPost: true,
        conteudo: true,
        dataHoraPublicacao: true,
        usuario: { idUsuario: true,nomeUsuario: true },
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
        usuario: { idUsuario: true, nomeUsuario: true },
        fotosPost: true,
      },
    });

    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    return post;
  }

  // Essa função que retorna todos os posts de um usuário específico, possibilitando a visualização do perfil.
  async findByUsuario(idUsuario: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario: idUsuario },
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    return this.postRepository
      .createQueryBuilder('post')
      .where('post.fk_Usuario_idUsuario = :idUsuario', { idUsuario })
      .leftJoinAndSelect('post.usuario', 'usuario')
      .leftJoinAndSelect('post.fotosPost', 'foto')
      .select([
        'post.idPost',
        'post.conteudo',
        'post.dataHoraPublicacao',
        'usuario.idUsuario',
        'usuario.matricula',
        'usuario.nomeUsuario',
        'foto.idFoto',
        'foto.url',
        'foto.ordem',
      ])
      .getMany();
  }

  // Atualização / Exclusão 

  async update(id: string, idUsuario: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({
      where: { idPost: id },
      relations: ['usuario'],
      select: {
        idPost: true,
        conteudo: true,
        dataHoraPublicacao: true,
        usuario: { idUsuario: true, nomeUsuario: true },
      },
    });

    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    if (post.usuario.idUsuario !== idUsuario) {
      throw new ForbiddenException(ErrorMessages.EUSR00013.mensagem);
    }

    if (updatePostDto.conteudo !== undefined) {
      post.conteudo = updatePostDto.conteudo;
    }

    const atualizado = await this.postRepository.save(post);
    return {
      idPost: atualizado.idPost,
      conteudo: atualizado.conteudo,
      dataHoraPublicacao: atualizado.dataHoraPublicacao,
      usuario: { nomeUsuario: atualizado.usuario?.nomeUsuario },
    };
  }

  // Função para remover post
  async remove(id: string, idUsuario: number) {
    const post = await this.postRepository.findOne({
      where: { idPost: id },
      relations: ['usuario', 'fotosPost', 'comentarios'], // Essa relações significam que o post vai buscar o usuário, as fotos e os comentários para deletar
    });

    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    if (post.usuario.idUsuario !== idUsuario) {
      throw new ForbiddenException(ErrorMessages.EUSR00013.mensagem);
    }

    // Deleta os likes dos comentários antes de deletar os comentários
    if (post.comentarios && post.comentarios.length > 0) {
      // Coleta os IDs dos comentários
      const commentIds = post.comentarios.map((c) => c.idComentario);
      // Deleta os likes dos comentários fazendo uma query SQL
      await this.dataSource.query(
        `DELETE FROM likeComentario WHERE comentarioIdComentario IN (${commentIds.map(() => '?').join(',')})`,
        commentIds,
      );
      // E, por fim, deleta os comentários para que não haja referências pendentes
      await this.comentarioRepository.remove(post.comentarios);
    }

    // Deleta os likes do post
    await this.dataSource.query(
      'DELETE FROM likePost WHERE postIdPost = ?',
      [id],
    );

    // Deleta as fotos do post
    if (post.fotosPost && post.fotosPost.length > 0) {
      await this.fotoPostRepository.remove(post.fotosPost);
    }

    // Por fim, deleta o post
    return await this.postRepository.remove(post);
  }

  // Fotos 

  async adicionarFotos(idPost: string, idUsuario: number, files: Express.Multer.File[]) {
    const post = await this.postRepository.findOne({
      where: { idPost },
      relations: ['usuario', 'fotosPost'],
      select: {
        idPost: true,
        conteudo: true,
        dataHoraPublicacao: true,
        usuario: { idUsuario: true },
        fotosPost: true,
      },
    });

    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    if (post.usuario.idUsuario !== idUsuario) {
      throw new ForbiddenException(ErrorMessages.EUSR00013.mensagem);
    }

    // pega a quantidade de fotos que já existem no post e soma com o índice do arquivo atual
    const ordemBase = (post.fotosPost ?? []).length;
    // cria um array de fotos com a url do arquivo e a ordem baseada na quantidade de fotos já existentes
    const novasFotos = files.map((file, index) =>
      this.fotoPostRepository.create({ url: file.path.replace(/\\/g, '/'), ordem: ordemBase + index, post }),
    );

    const fotosAdicionadas = await this.fotoPostRepository.save(novasFotos);
    // Adiciona as fotos novas ao array de fotos do post
    post.fotosPost = [...(post.fotosPost ?? []), ...fotosAdicionadas];

    return post;
  }

  async removerFotos(idPost: string, idUsuario: number, ids?: string[]) {
    const post = await this.postRepository.findOne({
      where: { idPost },
      relations: ['usuario', 'fotosPost'],
    });

    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    if (post.usuario.idUsuario !== idUsuario) {
      throw new ForbiddenException(ErrorMessages.EUSR00013.mensagem);
    }

    // Pega todas as fotos do post
    const todasFotos = post.fotosPost ?? [];

    // Se ids foram fornecidos, remove apenas as fotos com os ids especificados, caso contrário remove todas
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

  // Entrega quantas curtidas tem o post e quais usuarios curtiram
  async obterCurtidasPost(idPost: string) {
    const post = await this.postRepository.findOne({ where: { idPost } });
    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    const curtidas: { nomeUsuario: string }[] =
      await this.dataSource.query(
        `SELECT u.nomeUsuario
         FROM likePost lp
         INNER JOIN Usuario u ON u.idUsuario = lp.usuarioIdUsuario
         WHERE lp.postIdPost = ?`,
        [idPost],
      );

    return { total: curtidas.length, usuarios: curtidas };
  }

  async curtirPost(idPost: string, idUsuario: number) {
    const post = await this.postRepository.findOne({ where: { idPost } });
    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    // Verifica se o usuário já curtiu o post.
    const existing: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM likePost WHERE usuarioIdUsuario = ? AND postIdPost = ?',
      [idUsuario, idPost],
    );

    // Se já existe, lança exceção de conflito
    if (existing.length > 0) {
      throw new ConflictException(ErrorMessages.EUSR00018.mensagem);
    }

    // Insere a curtida na tabela likePost
    await this.dataSource.query(
      'INSERT INTO likePost (usuarioIdUsuario, postIdPost) VALUES (?, ?)',
      [idUsuario, idPost],
    );

    return { curtido: true };
  }

  async descurtirPost(idPost: string, idUsuario: number) {
    const post = await this.postRepository.findOne({ where: { idPost } });
    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    const existing: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM likePost WHERE usuarioIdUsuario = ? AND postIdPost = ?',
      [idUsuario, idPost],
    );

    if (existing.length === 0) {
      throw new NotFoundException(ErrorMessages.EUSR00019.mensagem);
    }

    await this.dataSource.query(
      'DELETE FROM likePost WHERE usuarioIdUsuario = ? AND postIdPost = ?',
      [idUsuario, idPost],
    );

    return { curtido: false };
  }

  async contarLikesDadosPorUsuario(idUsuario: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    const [totalRow]: [{ total: string }] = await this.dataSource.query(
      `SELECT COUNT(*) AS total
       FROM likePost lp
       JOIN Post p ON lp.postIdPost = p.idPost
       WHERE lp.usuarioIdUsuario = ?
         AND p.fk_Usuario_idUsuario != ?`,
      [idUsuario, idUsuario],
    );

    return { totalCurtidasEmPostsDeOutros: parseInt(totalRow.total, 10) };
  }

  // Comentários 

  async comentarPost(idPost: string, idUsuario: number, texto: string) {
    const post = await this.postRepository.findOne({ where: { idPost } });
    if (!post) {
      throw new NotFoundException(ErrorMessages.EUSR00012.mensagem);
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
      select: { idUsuario: true, nomeUsuario: true },
    });
    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    const comentario = this.comentarioRepository.create({ texto, post, usuario, dataHora: new Date() });
    return await this.comentarioRepository.save(comentario);
  }

  async removerComentario(idComentario: string, idUsuario: number) {
    const comentario = await this.comentarioRepository.findOne({
      where: { idComentario },
      relations: ['usuario'],
    });

    if (!comentario) {
      throw new NotFoundException(ErrorMessages.EUSR00020.mensagem);
    }

    if (comentario.usuario.idUsuario !== idUsuario) {
      throw new ForbiddenException(ErrorMessages.EUSR00013.mensagem);
    }

    return await this.comentarioRepository.remove(comentario);
  }
}
