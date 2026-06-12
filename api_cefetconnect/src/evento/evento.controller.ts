import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerEventoConfig } from '../uploads/multer.config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventoService } from './evento.service';
import { CreateEventoDto } from './dto/create-evento.dto';
import { UpdateEventoDto } from './dto/update-evento.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessMessages } from '../common/constants/messages.success';

@ApiTags('Eventos')
@Controller('evento')
export class EventoController {
  constructor(private readonly eventoService: EventoService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'capaEvento', maxCount: 1 },
    { name: 'fotoUrlEvento', maxCount: 1 },
  ], multerEventoConfig))
  @ApiOperation({ summary: 'Criar evento', description: 'Usuário autenticado cria um novo evento. Aceita multipart/form-data com campos opcionais capaEvento e fotoUrlEvento.' })
  @ApiResponse({ status: 201, description: '[SEVT00001] Evento criado com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  async create(
    @Body() createEventoDto: CreateEventoDto,
    @Request() req: any,
    @UploadedFiles()
    files?: { capaEvento?: Express.Multer.File[]; fotoUrlEvento?: Express.Multer.File[] },
  ) {
    const capaFile = files?.capaEvento?.[0];
    const fotoFile = files?.fotoUrlEvento?.[0];
    const dados = await this.eventoService.create(createEventoDto, req.user.idUsuario, capaFile, fotoFile);
    return { codigo: 'SEVT00001', mensagem: SuccessMessages.SEVT00001.mensagem, dados };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os eventos' })
  @ApiResponse({ status: 200, description: '[SEVT00002] Eventos retornados com sucesso.' })
  async findAll() {
    const dados = await this.eventoService.findAll();
    return { codigo: 'SEVT00002', mensagem: SuccessMessages.SEVT00002.mensagem, dados };
  }

  @Get('meus')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar eventos em que o usuário participa' })
  @ApiResponse({ status: 200, description: '[SEVT00005] Eventos do usuário retornados com sucesso.' })
  async findMyEvents(@Request() req: any) {
    const dados = await this.eventoService.findByUser(req.user.idUsuario);
    return { codigo: 'SEVT00005', mensagem: SuccessMessages.SEVT00005.mensagem, dados };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiOperation({ summary: 'Buscar evento por ID' })
  @ApiResponse({ status: 200, description: 'Evento retornado com sucesso.' })
  @ApiResponse({ status: 404, description: '[EEVT00001] Evento não encontrado.' })
  async findOne(@Param('id') id: string) {
    return this.eventoService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'capaEvento', maxCount: 1 },
    { name: 'fotoUrlEvento', maxCount: 1 },
  ], multerEventoConfig))
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiOperation({ summary: 'Editar evento (apenas o criador)', description: 'Aceita multipart/form-data com campos opcionais capaEvento e fotoUrlEvento.' })
  @ApiResponse({ status: 200, description: '[SEVT00003] Evento atualizado com sucesso.' })
  @ApiResponse({ status: 403, description: '[EEVT00002] Sem permissão para modificar.' })
  async update(
    @Param('id') id: string,
    @Body() updateEventoDto: UpdateEventoDto,
    @Request() req: any,
    @UploadedFiles()
    files?: { capaEvento?: Express.Multer.File[]; fotoUrlEvento?: Express.Multer.File[] },
  ) {
    const capaFile = files?.capaEvento?.[0];
    const fotoFile = files?.fotoUrlEvento?.[0];
    const dados = await this.eventoService.update(id, updateEventoDto, req.user.idUsuario, capaFile, fotoFile);
    return { codigo: 'SEVT00003', mensagem: SuccessMessages.SEVT00003.mensagem, dados };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do evento' })
  @ApiOperation({ summary: 'Excluir evento (apenas o criador)' })
  @ApiResponse({ status: 200, description: '[SEVT00004] Evento excluído com sucesso.' })
  @ApiResponse({ status: 403, description: '[EEVT00002] Sem permissão para excluir.' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const dados = await this.eventoService.remove(id, req.user.idUsuario);
    return { codigo: 'SEVT00004', mensagem: SuccessMessages.SEVT00004.mensagem, dados };
  }

  @Post(':id/participar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do evento para participar' })
  @ApiOperation({ summary: 'Participar de um evento' })
  @ApiResponse({ status: 200, description: '[SEVT00006] Você está participando do evento.' })
  @ApiResponse({ status: 403, description: '[EEVT00005] Você precisa ser membro da comunidade para participar deste evento.' })
  @ApiResponse({ status: 409, description: '[EEVT00003] Você já está participando deste evento.' })
  async participar(@Param('id') id: string, @Request() req: any) {
    const dados = await this.eventoService.participar(id, req.user.idUsuario);
    return { codigo: 'SEVT00006', mensagem: SuccessMessages.SEVT00006.mensagem, dados };
  }

  @Delete(':id/sair')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do evento para sair' })
  @ApiOperation({ summary: 'Sair de um evento' })
  @ApiResponse({ status: 200, description: '[SEVT00007] Você saiu do evento com sucesso.' })
  @ApiResponse({ status: 404, description: '[EEVT00004] Você não está participando deste evento.' })
  async sairEvento(@Param('id') id: string, @Request() req: any) {
    const dados = await this.eventoService.sairEvento(id, req.user.idUsuario);
    return { codigo: 'SEVT00007', mensagem: SuccessMessages.SEVT00007.mensagem, dados };
  }

}
