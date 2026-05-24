import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PinService } from './pin.service';
import { CreatePinDto } from './dto/create-pin.dto';
import { UpdatePinDto } from './dto/update-pin.dto';
import { ImportarPinsDto } from './dto/importar-pins.dto';
import { SugerirPinsDto } from './dto/sugerir-pins.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SuccessMessages } from '../common/constants/messages.success';

@Controller('pin')
export class PinController {
  constructor(private readonly pinService: PinService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Adicionar pin ao perfil (inserção manual)', description: 'Cria um novo pin acadêmico e o associa ao perfil do usuário autenticado.' })
  @ApiResponse({ status: 201, description: '[SPIN00001] Pin adicionado com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  async create(@Body() createPinDto: CreatePinDto, @Request() req: any) {
    const dados = await this.pinService.create(createPinDto, req.user.idUsuario);
    return { codigo: 'SPIN00001', mensagem: SuccessMessages.SPIN00001.mensagem, dados };
  }

  @Get('meus')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar meus pins', description: 'Retorna todos os pins do usuário autenticado.' })
  @ApiResponse({ status: 200, description: '[SPIN00002] Pins retornados com sucesso.' })
  async findMeus(@Request() req: any) {
    const dados = await this.pinService.findMeus(req.user.idUsuario);
    return { codigo: 'SPIN00002', mensagem: SuccessMessages.SPIN00002.mensagem, dados };
  }

  @Get('usuario/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do usuário cujos pins serão listados' })
  @ApiOperation({ summary: 'Listar pins de um usuário', description: 'Retorna os pins acadêmicos do perfil de outro usuário.' })
  @ApiResponse({ status: 200, description: '[SPIN00002] Pins retornados com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  async findByUsuario(@Param('id') id: string) {
    const dados = await this.pinService.findByUsuario(+id);
    return { codigo: 'SPIN00002', mensagem: SuccessMessages.SPIN00002.mensagem, dados };
  }

  @Post('sugerir')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gerar sugestões de pins a partir da grade/histórico acadêmico',
    description: 'Recebe a lista de disciplinas/conquistas do Gradment e retorna quais ainda não estão no perfil do usuário (sugestões) e quais já foram adicionadas.',
  })
  @ApiResponse({ status: 200, description: '[SPIN00006] Sugestões de pins geradas com sucesso.' })
  async sugerir(@Body() sugerirPinsDto: SugerirPinsDto, @Request() req: any) {
    const dados = await this.pinService.sugerir(sugerirPinsDto, req.user.idUsuario);
    return { codigo: 'SPIN00006', mensagem: SuccessMessages.SPIN00006.mensagem, dados };
  }

  @Post('importar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Importar pins do Gradment (inserção em lote)',
    description: 'Recebe uma lista de nomes de pins vindos do Gradment e os adiciona ao perfil do usuário como pins validados. Pins duplicados são ignorados e informados na resposta.',
  })
  @ApiResponse({ status: 201, description: '[SPIN00005] Pins importados do Gradment com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  async importar(@Body() importarPinsDto: ImportarPinsDto, @Request() req: any) {
    const dados = await this.pinService.importar(importarPinsDto, req.user.idUsuario);
    return { codigo: 'SPIN00005', mensagem: SuccessMessages.SPIN00005.mensagem, dados };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do pin' })
  @ApiOperation({ summary: 'Buscar detalhes de um pin', description: 'Retorna dados do pin, total de usuários que o possuem e comunidades relacionadas.' })
  @ApiResponse({ status: 200, description: '[SPIN00007] Detalhes do pin retornados com sucesso.' })
  @ApiResponse({ status: 404, description: '[EPIN00001] Pin não encontrado.' })
  async findDetalhes(@Param('id') id: string) {
    const dados = await this.pinService.findDetalhes(id);
    return { codigo: 'SPIN00007', mensagem: SuccessMessages.SPIN00007.mensagem, dados };
  }

  @Get(':id/usuarios')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do pin' })
  @ApiOperation({ summary: 'Listar usuários que possuem o pin' })
  @ApiResponse({ status: 200, description: '[SPIN00008] Usuários relacionados ao pin retornados com sucesso.' })
  @ApiResponse({ status: 404, description: '[EPIN00001] Pin não encontrado.' })
  async findUsuarios(@Param('id') id: string) {
    const dados = await this.pinService.findUsuariosByPin(id);
    return { codigo: 'SPIN00008', mensagem: SuccessMessages.SPIN00008.mensagem, dados };
  }

  @Get(':id/comunidades')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do pin' })
  @ApiOperation({ summary: 'Listar comunidades relacionadas ao pin' })
  @ApiResponse({ status: 200, description: '[SPIN00009] Comunidades relacionadas ao pin retornadas com sucesso.' })
  @ApiResponse({ status: 404, description: '[EPIN00001] Pin não encontrado.' })
  async findComunidades(@Param('id') id: string) {
    const dados = await this.pinService.findComunidadesByPin(id);
    return { codigo: 'SPIN00009', mensagem: SuccessMessages.SPIN00009.mensagem, dados };
  }

  @Post(':id/comunidades/:idComunidade')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do pin' })
  @ApiParam({ name: 'idComunidade', description: 'ID da comunidade a relacionar' })
  @ApiOperation({ summary: 'Relacionar pin a uma comunidade' })
  @ApiResponse({ status: 200, description: '[SPIN00010] Pin relacionado à comunidade com sucesso.' })
  @ApiResponse({ status: 404, description: '[EPIN00001] Pin não encontrado / [ECOM00001] Comunidade não encontrada.' })
  @ApiResponse({ status: 409, description: 'Pin já relacionado a esta comunidade.' })
  async adicionarComunidade(@Param('id') id: string, @Param('idComunidade') idComunidade: string) {
    const dados = await this.pinService.adicionarComunidade(id, idComunidade);
    return { codigo: 'SPIN00010', mensagem: SuccessMessages.SPIN00010.mensagem, dados };
  }

  @Delete(':id/comunidades/:idComunidade')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do pin' })
  @ApiParam({ name: 'idComunidade', description: 'ID da comunidade a desrelacionar' })
  @ApiOperation({ summary: 'Remover relacionamento pin-comunidade' })
  @ApiResponse({ status: 200, description: '[SPIN00011] Relacionamento pin-comunidade removido com sucesso.' })
  @ApiResponse({ status: 404, description: '[EPIN00001] Pin não encontrado / relacionamento não existe.' })
  async removerComunidade(@Param('id') id: string, @Param('idComunidade') idComunidade: string) {
    const dados = await this.pinService.removerComunidade(id, idComunidade);
    return { codigo: 'SPIN00011', mensagem: SuccessMessages.SPIN00011.mensagem, dados };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do pin' })
  @ApiOperation({ summary: 'Atualizar nome do pin (apenas o dono)' })
  @ApiResponse({ status: 200, description: '[SPIN00003] Pin atualizado com sucesso.' })
  @ApiResponse({ status: 403, description: '[EPIN00002] Sem permissão para modificar este pin.' })
  @ApiResponse({ status: 404, description: '[EPIN00001] Pin não encontrado.' })
  async update(@Param('id') id: string, @Body() updatePinDto: UpdatePinDto, @Request() req: any) {
    const dados = await this.pinService.update(id, updatePinDto, req.user.idUsuario);
    return { codigo: 'SPIN00003', mensagem: SuccessMessages.SPIN00003.mensagem, dados };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do pin' })
  @ApiOperation({ summary: 'Remover pin do perfil (apenas o dono)' })
  @ApiResponse({ status: 200, description: '[SPIN00004] Pin removido com sucesso.' })
  @ApiResponse({ status: 403, description: '[EPIN00002] Sem permissão para remover este pin.' })
  @ApiResponse({ status: 404, description: '[EPIN00001] Pin não encontrado.' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const dados = await this.pinService.remove(id, req.user.idUsuario);
    return { codigo: 'SPIN00004', mensagem: SuccessMessages.SPIN00004.mensagem, dados };
  }
}
