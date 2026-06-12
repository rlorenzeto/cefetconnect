import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class InteracaoService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async incrementarContador(idUsuario: number, valor: number = 1): Promise<void> {
    await this.usuarioRepository.increment(
      { idUsuario },
      'contadorInteracaoUsuario',
      valor,
    );
  }

  async decrementarContador(idUsuario: number, valor: number = 1): Promise<void> {
    const usuario = await this.usuarioRepository.findOne({
      where: { idUsuario },
      select: { idUsuario: true, contadorInteracaoUsuario: true },
    });

    if (usuario && usuario.contadorInteracaoUsuario > 0) {
      const novoValor = Math.max(0, usuario.contadorInteracaoUsuario - valor);
      await this.usuarioRepository.update(
        { idUsuario },
        { contadorInteracaoUsuario: novoValor },
      );
    }
  }

  async obterRanking(limit: number = 10): Promise<Usuario[]> {
    return this.usuarioRepository.find({
      order: { contadorInteracaoUsuario: 'DESC' },
      take: limit,
      select: {
        idUsuario: true,
        nomeUsuario: true,
        fotoUrl: true,
        contadorInteracaoUsuario: true,
      },
    });
  }
}
