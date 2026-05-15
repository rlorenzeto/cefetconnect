import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SuccessMessages } from '../common/constants/messages.success';

@ApiTags('Comentários')
@Controller('comentario')
export class ComentarioController {
  constructor(private readonly comentarioService: ComentarioService) {} 

  @Post('post/:idPost')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'idPost', description: 'ID do post a ser comentado' })
  @ApiOperation({ summary: 'Comentar post', description: 'Adiciona um comentário a um post. Usuário pode comentar o próprio post e pode comentar posts de outros usuários.' })
  @ApiResponse({ status: 201, description: '[SUSR00023] Comentário adicionado com sucesso.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  @ApiResponse({ status: 404, description: '[EUSR00012] Post não encontrado.' })
  async create(
    @Param('idPost') idPost: string, 
    @Body() createComentarioDto: CreateComentarioDto,
    @Request() req: any,
  ) {
    const dados = await this.comentarioService.create(idPost, req.user.matricula, createComentarioDto);
    return {
      codigo: 'SUSR00023',
      mensagem: SuccessMessages.SUSR00023.mensagem,
      dados,
    };
  }

  @Get('post/:idPost')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'idPost', description: 'ID do post cujos comentários serão listados' })
  @ApiOperation({ summary: 'Listar comentários do post', description: 'Retorna todos os comentários de um post ordenados por data.' })
  @ApiResponse({ status: 200, description: '[SUSR00029] Comentários retornados com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00012] Post não encontrado.' })
  async findByPost(@Param('idPost') idPost: string) {
    const dados = await this.comentarioService.findByPost(idPost);
    return {
      codigo: 'SUSR00029',
      mensagem: SuccessMessages.SUSR00029.mensagem,
      dados,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do comentário' })
  @ApiOperation({ summary: 'Buscar comentário', description: 'Retorna um comentário pelo ID.' })
  @ApiResponse({ status: 200, description: '[SUSR00030] Comentário retornado com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00020] Comentário não encontrado.' })
  async findOne(@Param('id') id: string) {
    const dados = await this.comentarioService.findOne(id);
    return {
      codigo: 'SUSR00030',
      mensagem: SuccessMessages.SUSR00030.mensagem,
      dados,
    };
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do comentário a ser editado' })
  @ApiOperation({ summary: 'Editar comentário', description: 'Atualiza o texto de um comentário. Apenas o autor pode editar.' })
  @ApiResponse({ status: 200, description: '[SUSR00032] Comentário atualizado com sucesso.' })
  @ApiResponse({ status: 403, description: '[EUSR00013] Sem permissão para editar este comentário.' })
  @ApiResponse({ status: 404, description: '[EUSR00020] Comentário não encontrado.' })
  async update(
    @Param('id') id: string,
    @Body() updateComentarioDto: UpdateComentarioDto,
    @Request() req: any,
  ) {
    const dados = await this.comentarioService.update(id, req.user.matricula, updateComentarioDto);
    return {
      codigo: 'SUSR00032',
      mensagem: SuccessMessages.SUSR00032.mensagem,
      dados,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do comentário a ser removido' })
  @ApiOperation({ summary: 'Remover comentário', description: 'Remove um comentário. Apenas o autor do comentário pode removê-lo.' })
  @ApiResponse({ status: 200, description: '[SUSR00024] Comentário removido com sucesso.' })
  @ApiResponse({ status: 403, description: '[EUSR00013] Sem permissão para remover este comentário.' })
  @ApiResponse({ status: 404, description: '[EUSR00020] Comentário não encontrado.' })
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.comentarioService.remove(id, req.user.matricula);
    return {
      codigo: 'SUSR00024',
      mensagem: SuccessMessages.SUSR00024.mensagem,
    };
  }

  @Post(':id/curtir')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do comentário a ser curtido' })
  @ApiOperation({ summary: 'Curtir comentário', description: 'Curte um comentário. Pode curtir o próprio comentário.' })
  @ApiResponse({ status: 200, description: '[SUSR00027] Comentário curtido com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00020] Comentário não encontrado.' })
  @ApiResponse({ status: 409, description: '[EUSR00021] Você já curtiu este comentário.' })
  async curtirComentario(@Param('id') id: string, @Request() req: any) {
    const dados = await this.comentarioService.curtirComentario(id, req.user.matricula);
    return {
      codigo: 'SUSR00027',
      mensagem: SuccessMessages.SUSR00027.mensagem,
      dados,
    };
  }

  @Delete(':id/curtir')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Descurtir comentário', description: 'Remove a curtida de um comentário.' })
  @ApiResponse({ status: 200, description: '[SUSR00028] Curtida de comentário removida com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00022] Curtida de comentário não encontrada.' })
  async descurtirComentario(@Param('id') id: string, @Request() req: any) {
    const dados = await this.comentarioService.descurtirComentario(id, req.user.matricula);
    return {
      codigo: 'SUSR00028',
      mensagem: SuccessMessages.SUSR00028.mensagem,
      dados,
    };
  }

  @Get(':id/curtidas')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do comentário' })
  @ApiOperation({ summary: 'Contar curtidas do comentário', description: 'Retorna o total de curtidas de um comentário.' })
  @ApiResponse({ status: 200, description: '[SUSR00031] Curtidas do comentário retornadas com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00020] Comentário não encontrado.' })
  async contarCurtidas(@Param('id') id: string) {
    const dados = await this.comentarioService.contarCurtidasComentario(id);
    return {
      codigo: 'SUSR00031',
      mensagem: SuccessMessages.SUSR00031.mensagem,
      dados,
    };
  }
}
