import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
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
  @ApiOperation({ summary: 'Criar comunidade', description: 'Usuário autenticado pode criar uma comunidade.' })
  @ApiResponse({ status: 201, description: '[SCOM00001] Comunidade criada com sucesso.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  async create(@Body() createComunidadeDto: CreateComunidadeDto, @Request() req: any) {
    const dados = await this.comunidadeService.create(createComunidadeDto, req.user.matricula);
    return {
      codigo: 'SCOM00001',
      mensagem: SuccessMessages.SCOM00001.mensagem,
      dados,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos as comunidades', description: 'Retorna todas as comunidades. Requer autenticação.' })
  @ApiResponse({ status: 200, description: '[SCOM00002] Comunidade retornada com sucesso.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  async findAll() { 
    const dados = await this.comunidadeService.findAll(); 
    return {
      codigo: 'SUSR00015',
      mensagem: SuccessMessages.SUSR00015.mensagem,
      dados,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID da comunidade a ser buscada.' })
  @ApiOperation({ summary: 'Buscar post específico', description: 'Retorna um post pelo ID com fotos e comentários.' })
  @ApiResponse({ status: 200, description: '[SUSR00002] Comunidade retornada com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00012] Comunidade não encontrada.' })
  async findOne(@Param('id') id: string) {
    return this.comunidadeService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateComunidadeDto: UpdateComunidadeDto, @Request() req: any) {
    return this.comunidadeService.update(id, updateComunidadeDto, req.user.matricula);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: any) {
    return this.comunidadeService.remove(id, req.user.matricula);
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
    const dados = await this.comunidadeService.entrar(id, req.user.matricula);
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
    const dados = await this.comunidadeService.sair(id, req.user.matricula);
    return {
      codigo: 'SCOM00004',
      mensagem: SuccessMessages.SCOM00004.mensagem,
      dados,
    };
  }
}
