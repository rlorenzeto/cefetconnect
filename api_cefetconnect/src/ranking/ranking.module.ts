import { Module } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { RankingController } from './ranking.controller';
import { InteracaoModule } from '../interacao/interacao.module';

@Module({
  imports: [InteracaoModule],
  controllers: [RankingController],
  providers: [RankingService],
})
export class RankingModule {}
