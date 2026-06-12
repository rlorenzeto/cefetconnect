import { Controller, Get, UseGuards } from '@nestjs/common';
import { RankingService } from './ranking.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessMessages } from '../common/constants/messages.success';

@ApiTags('Ranking')
@Controller('ranking')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RankingController {
  constructor(private readonly rankingService: RankingService) {}

  @Get('preview')
  @ApiOperation({ summary: 'Preview do ranking (top 3 usuários mais ativos)', description: 'Retorna os 3 usuários que mais interagem no sistema para exibição no feed.' })
  @ApiResponse({ status: 200, description: '[SRAN00001] Preview do ranking retornado com sucesso.' })
  async obterPreview() {
    const dados = await this.rankingService.obterRanking(3);
    return { codigo: 'SRAN00001', mensagem: SuccessMessages.SRAN00001.mensagem, dados };
  }

  @Get()
  @ApiOperation({ summary: 'Ranking completo (top 10 usuários mais ativos)', description: 'Retorna os 10 usuários que mais interagem no sistema.' })
  @ApiResponse({ status: 200, description: '[SRAN00002] Ranking completo retornado com sucesso.' })
  async obterRankingCompleto() {
    const dados = await this.rankingService.obterRanking(10);
    return { codigo: 'SRAN00002', mensagem: SuccessMessages.SRAN00002.mensagem, dados };
  }
}
