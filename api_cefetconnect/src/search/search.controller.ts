import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SearchService } from './search.service';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessMessages } from '../common/constants/messages.success';

@ApiTags('Busca')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Busca global',
    description: 'Busca usuários, eventos e posts pelo termo informado.',
  })
  @ApiQuery({ name: 'q', description: 'Termo de busca', example: 'cálculo' }) 
  @ApiResponse({ status: 200, description: '[SBSC00001] Busca realizada com sucesso.' })
  async search(@Query('q') q: string) {
    const dados = await this.searchService.search(q ?? '');
    return {
      codigo: 'SBSC00001',
      mensagem: SuccessMessages.SBSC00001.mensagem,
      dados,
    };
  }
}
