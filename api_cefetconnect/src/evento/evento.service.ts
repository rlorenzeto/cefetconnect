import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { InjectRepository, InjectDataSource } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { Evento } from '../entities/evento.entity';
import { Usuario } from '../entities/usuario.entity';
import { Comunidade } from '../entities/comunidade.entity';
import { Post } from '../entities/post.entity';
import { ErrorMessages } from '../common/constants/messages.errors';

@Injectable()
export class EventoService {
  constructor(
    @InjectRepository(Evento)
    private eventoRepository: Repository<Evento>,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Comunidade)
    private comunidadeRepository: Repository<Comunidade>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async create(dto: CreateEventoDto, idUsuario: number, capaFile?: Express.Multer.File, fotoFile?: Express.Multer.File) {
    const criador = await this.usuarioRepository.findOne({
      where: { idUsuario },
      select: { idUsuario: true, nomeUsuario: true },
    });
    if (!criador) throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);

    let comunidade: Comunidade | null = null;
    if (dto.comunidadeId) {
      comunidade = await this.comunidadeRepository.findOne({ where: { idComunidade: dto.comunidadeId } });
      if (!comunidade) throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
    }

    const dataEvento = new Date(dto.dataEvento);
    if (Number.isNaN(dataEvento.getTime()) || dataEvento <= new Date()) {
      throw new ForbiddenException('A data do evento precisa ser futura.');
    }

    const evento = this.eventoRepository.create({
      titulo: dto.titulo,
      descricaoEvento: dto.descricaoEvento,
      localEvento: dto.localEvento,
      status: dto.status ?? true,
      dataEvento: dataEvento,
      usuario: criador,
      comunidade: comunidade ?? undefined,
      capaEvento: capaFile ? capaFile.path.replace(/\\/g, '/') : null,
      fotoUrlEvento: fotoFile ? fotoFile.path.replace(/\\/g, '/') : null,
    });

    const eventoCriado = await this.eventoRepository.save(evento);

    await this.dataSource.query(
      `
        INSERT IGNORE INTO participaEvento (eventoIdEvento, usuarioIdUsuario)
        VALUES (?, ?)
      `,
      [eventoCriado.idEvento, criador.idUsuario],
    );

    const postEvento = this.postRepository.create({
      conteudo: dto.descricaoEvento || dto.titulo,
      usuario: criador,
      dataHoraPublicacao: new Date(),
      evento: eventoCriado,
      ...(comunidade && { comunidade }),
    });

    await this.postRepository.save(postEvento);

    return eventoCriado;
  }

  async findAll(page: number = 1) {
    const limite = 10;
    const skip = (page - 1) * limite;

    const [eventos, total] = await this.eventoRepository.findAndCount({
      relations: ['usuario', 'comunidade', 'participantes'],
      select: {
        idEvento: true,
        titulo: true,
        descricaoEvento: true,
        localEvento: true,
        status: true,
        dataEvento: true,
        capaEvento: true,
        fotoUrlEvento: true,
        usuario: {
          idUsuario: true,
          nomeUsuario: true,
          fotoUrl: true,
        },
        comunidade: { idComunidade: true, nomeComunidade: true },
        participantes: {
          idUsuario: true,
          nomeUsuario: true,
          fotoUrl: true,
        },
      },
      order: { dataEvento: 'ASC' },
      take: limite,
      skip,
    });

    return {
      dados: eventos,
      paginacao: {
        pagina: page,
        limite,
        total,
        totalPaginas: Math.ceil(total / limite),
      },
    };
  }

  async findOne(id: string) {
    const evento = await this.eventoRepository.findOne({
      where: { idEvento: id },
      relations: ['usuario', 'comunidade', 'participantes'],
      select: {
        idEvento: true,
        titulo: true,
        descricaoEvento: true,
        localEvento: true,
        status: true,
        dataEvento: true,
        capaEvento: true,
        fotoUrlEvento: true,
        usuario: {
          idUsuario: true,
          nomeUsuario: true,
          fotoUrl: true,
        },
        comunidade: { idComunidade: true, nomeComunidade: true },
        participantes: {
          idUsuario: true,
          nomeUsuario: true,
          fotoUrl: true,
        },
      },
    });

    if (!evento) throw new NotFoundException(ErrorMessages.EEVT00001.mensagem);
    return evento;
  }

  async findByUser(idUsuario: number) {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
      relations: [
        'eventosParticipados',
        'eventosParticipados.usuario',
        'eventosParticipados.comunidade',
      ],
      select: {
        idUsuario: true,
        eventosParticipados: {
          idEvento: true,
          titulo: true,
          descricaoEvento: true,
          localEvento: true,
          status: true,
          dataEvento: true,
          capaEvento: true,
          fotoUrlEvento: true,
          usuario: {
            idUsuario: true,
            nomeUsuario: true,
            fotoUrl: true,
          },
          comunidade: { idComunidade: true, nomeComunidade: true },
        },
      },
    });

    if (!usuario) throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);
    return usuario.eventosParticipados ?? [];
  }

  async update(id: string, dto: UpdateEventoDto, idUsuario: number, capaFile?: Express.Multer.File, fotoFile?: Express.Multer.File) {
    const evento = await this.eventoRepository.findOne({
      where: { idEvento: id },
      relations: ['usuario'],
    });

    if (!evento) throw new NotFoundException(ErrorMessages.EEVT00001.mensagem);
    if (evento.usuario?.idUsuario !== idUsuario) throw new ForbiddenException(ErrorMessages.EEVT00002.mensagem);

    if (dto.titulo !== undefined) evento.titulo = dto.titulo;
    if (dto.descricaoEvento !== undefined) evento.descricaoEvento = dto.descricaoEvento;
    if (dto.localEvento !== undefined) evento.localEvento = dto.localEvento;
    if (dto.status !== undefined) evento.status = dto.status;
    if (dto.dataEvento !== undefined) evento.dataEvento = new Date(dto.dataEvento);

    if (dto.comunidadeId !== undefined) {
      if (!dto.comunidadeId) {
        evento.comunidade = null as any;
      } else {
        const comunidade = await this.comunidadeRepository.findOne({ where: { idComunidade: dto.comunidadeId } });
        if (!comunidade) throw new NotFoundException(ErrorMessages.ECOM00001.mensagem);
        evento.comunidade = comunidade;
      }
    }

    if (capaFile) {
      if (evento.capaEvento) {
        const caminhoAntigo = join(process.cwd(), evento.capaEvento);
        await unlink(caminhoAntigo).catch(() => {});
      }
      evento.capaEvento = capaFile.path.replace(/\\/g, '/');
    }

    if (fotoFile) {
      if (evento.fotoUrlEvento) {
        const caminhoAntigo = join(process.cwd(), evento.fotoUrlEvento);
        await unlink(caminhoAntigo).catch(() => {});
      }
      evento.fotoUrlEvento = fotoFile.path.replace(/\\/g, '/');
    }

    await this.eventoRepository.save(evento);

    return await this.eventoRepository.findOne({
      where: { idEvento: id },
      relations: ['usuario', 'comunidade'],
      select: {
        idEvento: true,
        titulo: true,
        descricaoEvento: true,
        localEvento: true,
        status: true,
        dataEvento: true,
        capaEvento: true,
        fotoUrlEvento: true,
        usuario: {
          idUsuario: true,
          nomeUsuario: true,
          fotoUrl: true,
        },
        comunidade: { idComunidade: true, nomeComunidade: true },
      },
    });
  }

  async remove(id: string, idUsuario: number) {
    const evento = await this.eventoRepository.findOne({
      where: { idEvento: id },
      relations: ['usuario'],
      select: {
        idEvento: true,
        titulo: true,
        usuario: { idUsuario: true, nomeUsuario: true },
      },
    });

    if (!evento) throw new NotFoundException(ErrorMessages.EEVT00001.mensagem);
    if (evento.usuario?.idUsuario !== idUsuario) throw new ForbiddenException(ErrorMessages.EEVT00002.mensagem);

    const postsEvento: { idPost: string }[] = await this.dataSource.query(
    'SELECT idPost FROM post WHERE fk_Evento_idEvento = ?',
    [id],
    );

    for (const postEvento of postsEvento) {
      await this.dataSource.query(
      `DELETE likeComentario FROM likeComentario INNER JOIN comentario ON comentario.idComentario = likeComentario.comentarioIdComentario WHERE comentario.fk_Post_idPost = ? `,
      [postEvento.idPost],
    );

    await this.dataSource.query(
      'DELETE FROM comentario WHERE fk_Post_idPost = ?',
      [postEvento.idPost],
    );

    await this.dataSource.query(
      'DELETE FROM likePost WHERE postIdPost = ?',
      [postEvento.idPost],
    );

    await this.dataSource.query(
      'DELETE FROM post_fotos WHERE idPost = ?',
      [postEvento.idPost],
    );

    await this.dataSource.query(
      'DELETE FROM post WHERE idPost = ?',
      [postEvento.idPost],
    );
    }

    await this.eventoRepository.remove(evento);
    return { removido: true, idEvento: id, titulo: evento.titulo };
  }

  async participar(id: string, idUsuario: number) {
    const evento = await this.eventoRepository.findOne({
      where: { idEvento: id },
      relations: ['comunidade'],
    });
    if (!evento) throw new NotFoundException(ErrorMessages.EEVT00001.mensagem);
    if (!evento.status || evento.dataEvento < new Date()) {
      throw new ForbiddenException('Este evento já foi finalizado.');
    }

    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
      select: ['idUsuario', 'matricula'],
    });
    if (!usuario) throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);

    if (evento.comunidade) {
      const ehMembro: unknown[] = await this.dataSource.query(
        'SELECT 1 FROM participa WHERE usuarioIdUsuario = ? AND comunidadeIdComunidade = ?',
        [idUsuario, evento.comunidade.idComunidade],
      );
      if (ehMembro.length === 0) throw new ForbiddenException(ErrorMessages.EEVT00005.mensagem);
    }

    const jaParticipa: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM participaEvento WHERE eventoIdEvento = ? AND usuarioIdUsuario = ?',
      [id, idUsuario],
    );

    if (jaParticipa.length > 0) throw new ConflictException(ErrorMessages.EEVT00003.mensagem);

    await this.dataSource.query(
      'INSERT INTO participaEvento (eventoIdEvento, usuarioIdUsuario) VALUES (?, ?)',
      [id, idUsuario],
    );

    return { participando: true, idEvento: id };
  }

  async sairEvento(id: string, idUsuario: number) {
    const evento = await this.eventoRepository.findOne({ where: { idEvento: id } });
    if (!evento) throw new NotFoundException(ErrorMessages.EEVT00001.mensagem);

    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
      select: ['idUsuario'],
    });
    if (!usuario) throw new NotFoundException(ErrorMessages.EUSR00003.mensagem);

    // participaEvento não foi alterado no banco: ainda usa usuarioMatricula
    const jaParticipa: unknown[] = await this.dataSource.query(
      'SELECT 1 FROM participaEvento WHERE eventoIdEvento = ? AND usuarioIdUsuario = ?',
      [id, idUsuario],
    );

    if (jaParticipa.length === 0) throw new NotFoundException(ErrorMessages.EEVT00004.mensagem);

    await this.dataSource.query(
      'DELETE FROM participaEvento WHERE eventoIdEvento = ? AND usuarioIdUsuario = ?',
      [id, idUsuario],
    );

    return { saiu: true, idEvento: id };
  }
}
