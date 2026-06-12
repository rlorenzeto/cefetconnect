import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { IconeService } from './icone.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessMessages } from '../common/constants/messages.success.js';

@ApiTags('Ícones')
@Controller('icone')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IconeController {
  constructor(private readonly iconeService: IconeService) {}

  @Post('importar')
  @ApiOperation({
    summary: 'Importar ícones do Gradment',
    description: 'Importa ícones de eixos acadêmicos completados do Gradment. Cada ícone importado adiciona +5 pontos no ranking.',
  })
  @ApiResponse({ status: 200, description: 'Ícones importados com sucesso.' })
  @ApiResponse({ status: 400, description: 'Conta não conectada ao Gradment ou nenhum eixo encontrado.' })
  async importarIcones(@Request() req: any) {
    const idUsuario = req.user.idUsuario;
    const resultado = await this.iconeService.importarIconesDoGradment(idUsuario);

    return {
      codigo: resultado.adicionados.length > 0 ? 'SICO00001' : 'SICO00002',
      mensagem: resultado.adicionados.length > 0
        ? `${resultado.adicionados.length} ${SuccessMessages.SICO00001.mensagem}`
        : resultado.erro || SuccessMessages.SICO00002.mensagem,
      dados: resultado,
    };
  }

  @Get('meus')
  @ApiOperation({
    summary: 'Listar meus ícones',
    description: 'Retorna todos os ícones que o usuário possui.',
  })
  @ApiResponse({ status: 200, description: 'Ícones retornados com sucesso.' })
  async listarMeusIcones(@Request() req: any) {
    const idUsuario = req.user.idUsuario;
    const icones = await this.iconeService.listarIconesDoUsuario(idUsuario);

    return {
      codigo: 'SICO00003',
      mensagem: SuccessMessages.SICO00003.mensagem,
      dados: icones.map((pi) => ({
        idIcone: pi.icone.idIcone,
        nomeIcone: pi.icone.nomeIcone,
        descricaoIcone: pi.icone.descricaoIcone,
        codigoIcone: pi.icone.codigoIcone,
        dataConquistaIcone: pi.dataConquistaIcone,
      })),
    };
  }

  @Get('usuario/:idUsuario')
  @ApiOperation({
    summary: 'Listar ícones de outro usuário',
    description: 'Retorna todos os ícones que um usuário específico possui.',
  })
  @ApiResponse({ status: 200, description: 'Ícones retornados com sucesso.' })
  @ApiResponse({ status: 404, description: 'Usuário não encontrado.' })
  async listarIconesDoUsuario(@Param('idUsuario') idUsuario: string) {
    const icones = await this.iconeService.listarIconesDoUsuario(+idUsuario);

    return {
      codigo: 'SICO00004',
      mensagem: SuccessMessages.SICO00004.mensagem,
      dados: icones.map((pi) => ({
        idIcone: pi.icone.idIcone,
        nomeIcone: pi.icone.nomeIcone,
        descricaoIcone: pi.icone.descricaoIcone,
        codigoIcone: pi.icone.codigoIcone,
        dataConquistaIcone: pi.dataConquistaIcone,
      })),
    };
  }
}
