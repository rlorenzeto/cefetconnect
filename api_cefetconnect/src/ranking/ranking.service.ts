import { Injectable } from '@nestjs/common';
import { InteracaoService } from '../interacao/interacao.service';
import { Usuario } from '../entities/usuario.entity';

@Injectable()
export class RankingService {
  constructor(private readonly interacaoService: InteracaoService) {}

  async obterRanking(limit: number): Promise<Usuario[]> {
    return this.interacaoService.obterRanking(limit);
  }
}
