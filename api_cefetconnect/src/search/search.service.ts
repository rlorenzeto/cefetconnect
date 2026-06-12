import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Evento } from '../entities/evento.entity';
import { Post } from '../entities/post.entity';
import { Comunidade } from '../entities/comunidade.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Evento)
    private eventoRepository: Repository<Evento>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comunidade)
    private comunidadeRepository: Repository<Comunidade>,
  ) {}

  async search(q: string) {
    const termo = `%${q}%`;

    const [usuarios, eventos, posts, comunidades] = await Promise.all([
      this.usuarioRepository.find({
        where: { nomeUsuario: Like(termo) },
        select: {
          nomeUsuario: true,
          fotoUrl: true,
          biografia: true,
        },
        take: 10,
      }),

      this.eventoRepository.find({
        where: [
          { titulo: Like(termo) },
          { descricaoEvento: Like(termo) },
          { localEvento: Like(termo) },
        ],
        relations: ['usuario', 'comunidade'],
        select: {
          idEvento: true,
          titulo: true,
          descricaoEvento: true,
          localEvento: true,
          status: true,
          dataEvento: true,
          usuario: { nomeUsuario: true },
          comunidade: { idComunidade: true, nomeComunidade: true },
        },
        take: 10,
      }),

      this.postRepository.find({
        where: { conteudo: Like(termo) },
        relations: ['usuario', 'fotosPost'],
        select: {
          idPost: true,
          conteudo: true,
          dataHoraPublicacao: true,
          usuario: { nomeUsuario: true },
          fotosPost: true,
        },
        take: 10,
      }),

      this.comunidadeRepository.find({
        where: [
          { nomeComunidade: Like(termo) },
          { descricaoComunidade: Like(termo) },
        ],
        relations: ['criador'],
        select: {
          idComunidade: true,
          nomeComunidade: true,
          descricaoComunidade: true,
          fotoUrlComunidade: true,
          criador: { nomeUsuario: true },
        },
        take: 10,
      }),
    ]);

    return { usuarios, eventos, posts, comunidades };
  }
}
