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
    });

    const comunidadeCriada = await this.comunidadeRepository.save(novaComunidade);
    await this.dataSource.query(
      `
      INSERT IGNORE INTO participa (usuarioIdUsuario, comunidadeIdComunidade)
      VALUES (?, ?)
      `,
      [idUsuario, comunidadeCriada.idComunidade],
    );

    return comunidadeCriada;
  }

  async findAll(idUsuario?: number) { 
    const comunidades = await this.dataSource.query(
      ` 
      SELECT 
        c.idComunidade, 
        c.nomeComunidade, 
        c.descricaoComunidade, 
        c.capaComunidade, 
        c.fotoUrlComunidade, 
        criador.idUsuario AS idCriador, 
        criador.nomeUsuario AS nomeCriador, 
        COUNT(DISTINCT p.usuarioIdUsuario) AS totalMembros, 
        COUNT(DISTINCT post.idPost) AS totalPosts, 
        CASE 
          WHEN minhaParticipacao.usuarioIdUsuario IS NULL THEN 0 
          ELSE 1 
        END AS isMembro 
      FROM comunidade c 
      LEFT JOIN usuario criador 
        ON criador.idUsuario = c.fk_Usuario_idUsuario 
      LEFT JOIN participa p 
        ON p.comunidadeIdComunidade = c.idComunidade 
      LEFT JOIN post 
        ON post.fk_Comunidade_idComunidade = c.idComunidade 
      LEFT JOIN participa minhaParticipacao 
        ON minhaParticipacao.comunidadeIdComunidade = c.idComunidade 
        AND minhaParticipacao.usuarioIdUsuario = ? 
      GROUP BY 
        c.idComunidade, 
        c.nomeComunidade, 
        c.descricaoComunidade, 
        c.capaComunidade, 
        c.fotoUrlComunidade, 
        criador.idUsuario, 
        criador.nomeUsuario, 
        minhaParticipacao.usuarioIdUsuario 
      ORDER BY c.nomeComunidade ASC 
      `,
      [idUsuario || 0],
    );

    return comunidades.map((comunidade) => ({
      ...comunidade,
      isMembro: Boolean(Number(comunidade.isMembro)),
      totalMembros: Number(comunidade.totalMembros || 0),
      totalPosts: Number(comunidade.totalPosts || 0),
    }));
  }

  async findOne(id: string, idUsuario: number) {
    const rows = await this.dataSource.query(
      `
      SELECT
        c.idComunidade,
        c.nomeComunidade,
        c.descricaoComunidade,
        c.capaComunidade,
        c.fotoUrlComunidade,

        criador.idUsuario AS idCriador,
        criador.nomeUsuario AS nomeCriador,

        COUNT(DISTINCT p.usuarioIdUsuario) AS totalMembros,
        COUNT(DISTINCT post.idPost) AS totalPosts,

        CASE
          WHEN minhaParticipacao.usuarioIdUsuario IS NULL THEN 0
          ELSE 1
        END AS isMembro
      FROM comunidade c
      LEFT JOIN usuario criador
        ON criador.idUsuario = c.fk_Usuario_idUsuario
      LEFT JOIN participa p
        ON p.comunidadeIdComunidade = c.idComunidade
      LEFT JOIN post
        ON post.fk_Comunidade_idComunidade = c.idComunidade
      LEFT JOIN participa minhaParticipacao
        ON minhaParticipacao.comunidadeIdComunidade = c.idComunidade
        AND minhaParticipacao.usuarioIdUsuario = ?
      WHERE c.idComunidade = ?
      GROUP BY
        c.idComunidade,
        c.nomeComunidade,
        c.descricaoComunidade,
        c.capaComunidade,
        c.fotoUrlComunidade,
        criador.idUsuario,
        criador.nomeUsuario,
        minhaParticipacao.usuarioIdUsuario
      LIMIT 1
      `,
      [idUsuario, id],
    );

    if (rows.length === 0) {
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    const comunidade = rows[0];

    const membros = await this.dataSource.query(
      `
      SELECT
        u.idUsuario,
        u.nomeUsuario,
        u.fotoUrl
      FROM participa p
      INNER JOIN usuario u
        ON u.idUsuario = p.usuarioIdUsuario
      WHERE p.comunidadeIdComunidade = ?
      ORDER BY u.nomeUsuario ASC
      `,
      [id],
    );

    return {
      idComunidade: comunidade.idComunidade,
      nomeComunidade: comunidade.nomeComunidade,
      descricaoComunidade: comunidade.descricaoComunidade,
      capaComunidade: comunidade.capaComunidade,
      fotoUrlComunidade: comunidade.fotoUrlComunidade,

      criador: {
        idUsuario: comunidade.idCriador,
        nomeUsuario: comunidade.nomeCriador,
      },

      isMembro: Boolean(Number(comunidade.isMembro)),
      totalMembros: Number(comunidade.totalMembros || 0),
      totalPosts: Number(comunidade.totalPosts || 0),
      membros,
    };
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

  async findMembros(idComunidade: string) {
    const comunidade = await this.comunidadeRepository.findOne({
      where: { idComunidade },
      select: { idComunidade: true },
    });

    if (!comunidade) {
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    return this.dataSource.query(
      `
      SELECT
        u.idUsuario,
        u.nomeUsuario,
        u.fotoUrl
      FROM participa p
      INNER JOIN usuario u
        ON u.idUsuario = p.usuarioIdUsuario
      WHERE p.comunidadeIdComunidade = ?
      ORDER BY u.nomeUsuario ASC
      `,
      [idComunidade],
    );
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

  async findByUsuario(idUsuario: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
    });

    if (!usuario) {
      throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    }

    return await this.dataSource.query(
      ` 
      SELECT 
        c.idComunidade, 
        c.nomeComunidade, 
        c.descricaoComunidade, 
        c.capaComunidade, 
        c.fotoUrlComunidade, 
        criador.idUsuario AS idCriador, 
        criador.nomeUsuario AS nomeCriador, 
        COUNT(DISTINCT p2.usuarioIdUsuario) AS totalMembros, 
        COUNT(DISTINCT post.idPost) AS totalPosts 
      FROM participa p 
      INNER JOIN comunidade c 
        ON c.idComunidade = p.comunidadeIdComunidade 
      LEFT JOIN usuario criador 
        ON criador.idUsuario = c.fk_Usuario_idUsuario 
      LEFT JOIN participa p2 
        ON p2.comunidadeIdComunidade = c.idComunidade 
      LEFT JOIN post 
        ON post.fk_Comunidade_idComunidade = c.idComunidade 
      WHERE p.usuarioIdUsuario = ? 
      GROUP BY 
        c.idComunidade, 
        c.nomeComunidade, 
        c.descricaoComunidade, 
        c.capaComunidade, 
        c.fotoUrlComunidade, 
        criador.idUsuario, 
        criador.nomeUsuario 
      ORDER BY c.nomeComunidade ASC 
      `,
      [idUsuario],
    );
  }

  async findPosts(idComunidade: string, idUsuario: number) {
    const comunidade = await this.comunidadeRepository.findOne({
      where: { idComunidade },
    });

    if (!comunidade) {
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    const membro: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM participa WHERE usuarioIdUsuario = ? AND comunidadeIdComunidade = ?',
      [idUsuario, idComunidade],
    );

    if (membro.length === 0) {
      throw new ForbiddenException(ErrorMessages.ECOM00003.mensagem);
    }

    const posts = await this.dataSource.query(
      ` 
      SELECT
      p.idPost,
      p.conteudo,
      p.dataHoraPublicacao,

      u.idUsuario AS usuario_idUsuario,
      u.nomeUsuario AS usuario_nomeUsuario,
      u.fotoUrl AS usuario_fotoUrl,

      c.idComunidade AS comunidade_idComunidade,
      c.nomeComunidade AS comunidade_nomeComunidade,

      criador.idUsuario AS comunidade_idCriador,
      criador.nomeUsuario AS comunidade_nomeCriador,

      e.idEvento AS evento_idEvento,
      e.titulo AS evento_titulo,
      e.descricaoEvento AS evento_descricaoEvento,
      e.localEvento AS evento_localEvento,
      e.status AS evento_status,
      e.dataEvento AS evento_dataEvento,
      e.capaEvento AS evento_capaEvento,
      e.fotoUrlEvento AS evento_fotoUrlEvento,

      pe.usuarioIdUsuario AS evento_participanteAtual,

      COUNT(DISTINCT comentario.idComentario) AS totalComentarios
      FROM post p
      INNER JOIN usuario u
      ON u.idUsuario = p.fk_Usuario_idUsuario
      INNER JOIN comunidade c
      ON c.idComunidade = p.fk_Comunidade_idComunidade
      LEFT JOIN usuario criador
      ON criador.idUsuario = c.fk_Usuario_idUsuario
      LEFT JOIN evento e
      ON e.idEvento = p.fk_Evento_idEvento
      LEFT JOIN participaEvento pe
      ON pe.eventoIdEvento = e.idEvento
      AND pe.usuarioIdUsuario = ?
      LEFT JOIN comentario
      ON comentario.fk_Post_idPost = p.idPost
      WHERE c.idComunidade = ?
      GROUP BY
        p.idPost,
        p.conteudo,
        p.dataHoraPublicacao,
        u.idUsuario,
        u.nomeUsuario,
        u.fotoUrl,
        c.idComunidade,
        c.nomeComunidade,
        criador.idUsuario,
        criador.nomeUsuario,
        e.idEvento,
        e.titulo,
        e.descricaoEvento,
        e.localEvento,
        e.status,
        e.dataEvento,
        e.capaEvento,
        e.fotoUrlEvento,
        pe.usuarioIdUsuario
      `,
      [idUsuario, idComunidade],
    );

    const postsFormatados = await Promise.all(
      posts.map(async (post) => {
       const fotosPost = await this.dataSource.query(
          `
          SELECT 
            id_foto AS idFoto,
            url,
            ordem
          FROM post_fotos
          WHERE idPost = ?
          ORDER BY ordem ASC
          `,
          [post.idPost],
        );

        return {
          idPost: post.idPost,
          conteudo: post.conteudo,
          dataHoraPublicacao: post.dataHoraPublicacao,
          totalComentarios: Number(post.totalComentarios || 0),
          usuario: {
            idUsuario: post.usuario_idUsuario,
            nomeUsuario: post.usuario_nomeUsuario,
            fotoUrl: post.usuario_fotoUrl,
          },
          comunidade: {
            idComunidade: post.comunidade_idComunidade,
            nomeComunidade: post.comunidade_nomeComunidade,
            criador: {
              idUsuario: post.comunidade_idCriador,
              nomeUsuario: post.comunidade_nomeCriador,
            },
          },
          evento: post.evento_idEvento
            ? {
                idEvento: post.evento_idEvento,
                titulo: post.evento_titulo,
                descricaoEvento: post.evento_descricaoEvento,
                localEvento: post.evento_localEvento,
                status: Boolean(Number(post.evento_status)),
                dataEvento: post.evento_dataEvento,
                capaEvento: post.evento_capaEvento,
                fotoUrlEvento: post.evento_fotoUrlEvento,
                isParticipando: Boolean(post.evento_participanteAtual),

                comunidade: {
                  idComunidade: post.comunidade_idComunidade,
                  nomeComunidade: post.comunidade_nomeComunidade,
                },
              }
            : null,

          fotosPost,
        };
      }),
    );

    return postsFormatados;
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

    if (!comunidade)
      throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
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
