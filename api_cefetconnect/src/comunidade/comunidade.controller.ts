import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFiles, Query, ParseIntPipe } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerComunidadeConfig } from '../uploads/multer.config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ComunidadeService } from './comunidade.service';
import { CreateComunidadeDto } from './dto/create-comunidade.dto';
import { UpdateComunidadeDto } from './dto/update-comunidade.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { SuccessMessages } from '../common/constants/messages.success';

@Controller('comunidade')
export class ComunidadeController {
  constructor(private readonly comunidadeService: ComunidadeService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'capaComunidade', maxCount: 1 },
    { name: 'fotoUrlComunidade', maxCount: 1 },
  ], multerComunidadeConfig))
  @ApiOperation({ summary: 'Criar comunidade', description: 'Usuário autenticado pode criar uma comunidade. Aceita multipart/form-data com campos opcionais capaComunidade e fotoUrlComunidade.' })
  @ApiResponse({ status: 201, description: '[SCOM00001] Comunidade criada com sucesso.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  async create(
    @Body() createComunidadeDto: CreateComunidadeDto,
    @Request() req: any,
    @UploadedFiles()
    files?: { capaComunidade?: Express.Multer.File[]; fotoUrlComunidade?: Express.Multer.File[] },
  ) {
    const capaFile = files?.capaComunidade?.[0];
    const fotoFile = files?.fotoUrlComunidade?.[0];
    const dados = await this.comunidadeService.create(createComunidadeDto, req.user.idUsuario, capaFile, fotoFile);
    return {
      codigo: 'SCOM00001',
      mensagem: SuccessMessages.SCOM00001.mensagem,
      dados,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas as comunidades', description: 'Retorna todas as comunidades. Requer autenticação.' })
  @ApiResponse({ status: 200, description: '[SCOM00002] Comunidade retornada com sucesso.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  async findAll(@Request() req: any) {
    const dados = await this.comunidadeService.findAll(req.user.idUsuario);
    return {
      codigo: 'SCOM00007',
      mensagem: SuccessMessages.SCOM00007.mensagem,
      dados,
    };
  }

  @Get('minhas-disciplinas')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar disciplinas do usuário no Gradment', description: 'Retorna as matérias aprovadas do usuário logado no Gradment. Usado para popular o dropdown ao criar uma comunidade vinculada.' })
  @ApiResponse({ status: 200, description: 'Lista de disciplinas retornada com sucesso.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  async findMinhasDisciplinas(@Request() req: any) {
    const dados = await this.comunidadeService.findMinhasDisciplinas(req.user.email);
    return { dados };
  }

  @Get('disciplina/:disciplinaId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'disciplinaId', description: 'ID da disciplina do Gradment (materia_id)' })
  @ApiOperation({ summary: 'Listar comunidades por disciplina do Gradment', description: 'Retorna comunidades vinculadas a uma disciplina específica do Gradment.' })
  @ApiResponse({ status: 200, description: '[SCOM00007] Comunidades retornadas com sucesso.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  async findPorDisciplina(@Param('disciplinaId', ParseIntPipe) disciplinaId: number) {
    const dados = await this.comunidadeService.findPorDisciplina(disciplinaId);
    return {
      codigo: 'SCOM00007',
      mensagem: SuccessMessages.SCOM00007.mensagem,
      dados,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID da comunidade a ser buscada.' })
  @ApiOperation({ summary: 'Buscar uma comunidade específica', description: 'Retorna a comunidade específica.' })
  @ApiResponse({ status: 200, description: '[SUSR00002] Comunidade retornada com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00008] Comunidade não encontrada.' })
  async findOne(@Param('id') id: string, @Request() req: any) {
    const dados = await this.comunidadeService.findOne(id, req.user.idUsuario);

    return {
      codigo: 'SCOM00002',
      mensagem: SuccessMessages.SCOM00002.mensagem,
      dados,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'capaComunidade', maxCount: 1 },
    { name: 'fotoUrlComunidade', maxCount: 1 },
  ], multerComunidadeConfig))
  @ApiOperation({ summary: 'Atualizar comunidade', description: 'Atualiza dados da comunidade. Aceita multipart/form-data com campos opcionais capaComunidade e fotoUrlComunidade.' })
  @ApiResponse({ status: 200, description: '[SCOM00005] Comunidade atualizada com sucesso.' })
  @ApiResponse({ status: 403, description: '[ECOM00002] Sem permissão para modificar esta comunidade.' })
  @ApiResponse({ status: 404, description: '[ECOM00001] Comunidade não encontrada.' })
  async update(
    @Param('id') id: string,
    @Body() updateComunidadeDto: UpdateComunidadeDto,
    @Request() req: any,
    @UploadedFiles()
    files?: { capaComunidade?: Express.Multer.File[]; fotoUrlComunidade?: Express.Multer.File[] },
  ) {
    const capaFile = files?.capaComunidade?.[0];
    const fotoFile = files?.fotoUrlComunidade?.[0];
    const dados = await this.comunidadeService.update(id, updateComunidadeDto, req.user.idUsuario, capaFile, fotoFile);
    return { codigo: 'SCOM00005', mensagem: SuccessMessages.SCOM00005.mensagem, dados };
  }

@Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID da comunidade a ser deletada.' })
  @ApiOperation({ summary: 'Deletar comunidade', description: 'Deleta a comunidade. Apenas o criador pode realizar esta ação.' })
  @ApiResponse({ status: 200, description: '[SCOM00006] Comunidade excluída com sucesso.' })
  @ApiResponse({ status: 403, description: '[SCOM00009] Você não tem autorização para deletar essa comunidade.' })
  @ApiResponse({ status: 404, description: '[SCOM00008] Comunidade não encontrada.' })
  async remove(@Param('id') id: string, @Request() req: any) {
    const comunidade = await this.comunidadeService.remove(id, req.user.idUsuario);
    return {
      codigo: 'SCOM00006', 
      mensagem: SuccessMessages.SCOM00006.mensagem, 
      dados: {
        idComunidade: id,
        nomeComunidade: comunidade.nomeComunidade,
        nomeCriador: comunidade.criador?.nomeUsuario,
      },
    };
  }

  @Get(':id/posts')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID da comunidade' })
  @ApiOperation({
    summary: 'Listar posts de uma comunidade',
    description: 'Retorna os posts da comunidade se o usuário for membro.',
  })
  async findPosts(@Param('id') id: string, @Request() req: any) {
    const dados = await this.comunidadeService.findPosts(id, req.user.idUsuario);
    return {
      codigo: 'SCOM00009',
      mensagem: 'Posts da comunidade retornados com sucesso.',
      dados,
    };
  }

  @Get(':id/eventos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID da comunidade' })
  @ApiOperation({ summary: 'Listar eventos de uma comunidade', description: 'Retorna todos os eventos associados à comunidade informada.' })
  @ApiResponse({ status: 200, description: '[SCOM00010] Eventos da comunidade retornados com sucesso.' })
  @ApiResponse({ status: 404, description: '[ECOM00001] Comunidade não encontrada.' })
  async findEventos(@Param('id') id: string) {
    const dados = await this.comunidadeService.findEventos(id);
    return { codigo: 'SCOM00010', mensagem: SuccessMessages.SCOM00010.mensagem, dados };
  }

  @Post(':id/entrar')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID da comunidade para entrar.' })
  @ApiOperation({ summary: 'Entrar em uma comunidade', description: 'Usuário autenticado passa a ser membro da comunidade.' })
  @ApiResponse({ status: 200, description: '[SCOM00003] Você entrou na comunidade com sucesso.' })
  @ApiResponse({ status: 404, description: '[ECOM00001] Comunidade não encontrada.' })
  @ApiResponse({ status: 409, description: '[ECOM00004] Você já é membro desta comunidade.' })
  async entrar(@Param('id') id: string, @Request() req: any) {
    const dados = await this.comunidadeService.entrar(id, req.user.idUsuario);
    return {
      codigo: 'SCOM00003',
      mensagem: SuccessMessages.SCOM00003.mensagem,
      dados,
    };
  }

  @Delete(':id/sair')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID da comunidade para sair.' })
  @ApiOperation({ summary: 'Sair de uma comunidade', description: 'Usuário autenticado deixa de ser membro da comunidade.' })
  @ApiResponse({ status: 200, description: '[SCOM00004] Você saiu da comunidade com sucesso.' })
  @ApiResponse({ status: 404, description: '[ECOM00001] Comunidade não encontrada / [ECOM00005] Você não é membro desta comunidade.' })
  async sair(@Param('id') id: string, @Request() req: any) {
    const dados = await this.comunidadeService.sair(id, req.user.idUsuario);
    return {
      codigo: 'SCOM00004',
      mensagem: SuccessMessages.SCOM00004.mensagem,
      dados,
    };
  }
}
