import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, UseInterceptors, UploadedFiles, ParseIntPipe, Query } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PostService } from './post.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { RemoverFotosDto } from './dto/remover-fotos.dto';
import { SuccessMessages } from '../common/constants/messages.success';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PostRateLimitGuard } from '../throttling/post-rate-limit.guard';
import { multerPostFotosConfig } from '../uploads/multer.config';

@ApiTags('Posts')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PostRateLimitGuard)
  @UseInterceptors(FilesInterceptor('fotos', 10, multerPostFotosConfig))  
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Criar post', description: 'Usuário autenticado cria um novo post. Pode enviar 0, 1 ou várias fotos (multipart/form-data).' })
  @ApiBody({ schema: { type: 'object', properties: { conteudo: { type: 'string', example: 'Texto do post' }, fotos: { type: 'array', items: { type: 'string', format: 'binary' } } } } })
  @ApiResponse({ status: 201, description: '[SUSR00012] Post criado com sucesso.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  @ApiResponse({ status: 400, description: 'O conteúdo do post deve ter pelo menos 20 caracteres.' })
  @ApiResponse({ status: 403, description: 'Você atingiu o limite de 5 posts por hora. Tente novamente mais tarde.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  async create(@Body() createPostDto: CreatePostDto, @UploadedFiles() fotos: Express.Multer.File[], @Request() req: any) {
    const dados = await this.postService.create(createPostDto, req.user.idUsuario, fotos);
    return {
      codigo: 'SUSR00012',
      mensagem: SuccessMessages.SUSR00012.mensagem,
      dados,
    };
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os posts', description: 'Retorna todos os posts com suas fotos paginados (10 por página). Requer autenticação.' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Número da página (padrão: 1)' })
  @ApiResponse({ status: 200, description: '[SUSR00015] Posts retornados com sucesso.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  async findAll(@Request() req: any, @Query('page') page?: string) { 
    const pagina = page ? Math.max(1, parseInt(page, 10)) : 1;
    const resultado = await this.postService.findAll(req.user.idUsuario, pagina);

    return {
      codigo: 'SUSR00015',
      mensagem: SuccessMessages.SUSR00015.mensagem,
      ...resultado,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do post a ser buscado' })
  @ApiOperation({ summary: 'Buscar post específico', description: 'Retorna um post pelo ID com fotos e comentários.' })
  @ApiResponse({ status: 200, description: '[SUSR00015] Post retornado com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00012] Post não encontrado.' })
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do post a ser atualizado' })
  @ApiOperation({ summary: 'Atualizar post', description: 'Atualiza o conteúdo do próprio post.' })
  @ApiResponse({ status: 200, description: '[SUSR00016] Post atualizado com sucesso.' })
  @ApiResponse({ status: 403, description: '[EUSR00013] Sem permissão para alterar este post.' })
  @ApiResponse({ status: 404, description: '[EUSR00012] Post não encontrado.' })
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Request() req: any) {
    const dados = await this.postService.update(id, req.user.idUsuario, updatePostDto);
    return {
      codigo: 'SUSR00016',
      mensagem: SuccessMessages.SUSR00016.mensagem,
      dados,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do post a ser deletado' })
  @ApiOperation({ summary: 'Deletar post', description: 'Deleta o próprio post e todas as suas fotos.' })
  @ApiResponse({ status: 200, description: '[SUSR00017] Post deletado com sucesso.' })
  @ApiResponse({ status: 403, description: '[EUSR00013] Sem permissão para deletar este post.' })
  @ApiResponse({ status: 404, description: '[EUSR00012] Post não encontrado.' })
  async remove(@Param('id') id: string, @Request() req: any) {
    await this.postService.remove(id, req.user.idUsuario);
    return {
      codigo: 'SUSR00017',
      mensagem: SuccessMessages.SUSR00017.mensagem,
    };
  }

  // Fotos 

  @Post(':id/fotos')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('fotos', 10, multerPostFotosConfig))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'ID do post que receberá as fotos' })
  @ApiOperation({ summary: 'Adicionar fotos', description: 'Adiciona uma ou mais fotos ao post via upload. Apenas o autor pode adicionar.' })
  @ApiBody({ schema: { type: 'object', properties: { fotos: { type: 'array', items: { type: 'string', format: 'binary' } } } } })
  @ApiResponse({ status: 201, description: '[SUSR00018] Fotos adicionadas com sucesso.' })
  @ApiResponse({ status: 403, description: '[EUSR00013] Sem permissão.' })
  @ApiResponse({ status: 404, description: '[EUSR00012] Post não encontrado.' })
  async adicionarFotos( 
    @Param('id') id: string, // ID do post 
    @UploadedFiles() fotos: Express.Multer.File[], // Fotos enviadas via multipart/form-data 
    @Request() req: any, // Usuário autenticado
  ) {
    const dados = await this.postService.adicionarFotos(id, req.user.idUsuario, fotos ?? []); // Adiciona as fotos ao post da seguinte forma: [id, idUsuario, fotos]
    return {
      codigo: 'SUSR00018',
      mensagem: SuccessMessages.SUSR00018.mensagem,
      dados,
    };
  }

  @Get(':id/fotos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do post' })
  @ApiOperation({ summary: 'Listar fotos do post', description: 'Retorna todas as fotos de um post.' })
  @ApiResponse({ status: 200, description: '[SUSR00019] Fotos retornadas com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00012] Post não encontrado.' })
  // essa função retorna todas as fotos de um post
  async obterFotos(@Param('id') id: string) {
    const dados = await this.postService.obterFotosPost(id); 
    return {
      codigo: 'SUSR00019',
      mensagem: SuccessMessages.SUSR00019.mensagem,
      dados,
    };
  }

  @Delete(':id/fotos')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do post' })
  @ApiOperation({
    summary: 'Remover fotos do post',
    description:
      'Remove fotos de um post. Se informar "ids", remove apenas as fotos selecionadas. Se não informar, remove todas. Apenas o autor pode remover.',
  })
  @ApiBody({ type: RemoverFotosDto, required: false })
  @ApiResponse({ status: 200, description: '[SUSR00025] Fotos removidas com sucesso.' })
  @ApiResponse({ status: 403, description: '[EUSR00013] Sem permissão.' })
  @ApiResponse({ status: 404, description: '[EUSR00012] Post não encontrado.' })
  async removerFotos(
    @Param('id') id: string,
    @Body() removerFotosDto: RemoverFotosDto,
    @Request() req: any,
  ) {
    const dados = await this.postService.removerFotos(id, req.user.idUsuario, removerFotosDto?.ids);
    return {
      codigo: 'SUSR00025',
      mensagem: SuccessMessages.SUSR00025.mensagem,
      dados,
    };
  }

  // Curtidas 

  @Post(':id/curtir')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do post a ser curtido' })
  @ApiOperation({ summary: 'Curtir post', description: 'Curte um post. Pode curtir o próprio post.' })
  @ApiResponse({ status: 200, description: '[SUSR00021] Post curtido com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00012] Post não encontrado.' })
  @ApiResponse({ status: 409, description: '[EUSR00018] Você já curtiu este post.' })
  async curtirPost(@Param('id') id: string, @Request() req: any) {
    const dados = await this.postService.curtirPost(id, req.user.idUsuario);
    return {
      codigo: 'SUSR00021',
      mensagem: SuccessMessages.SUSR00021.mensagem,
      dados,
    };
  }

  @Delete(':id/curtir')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do post a ser descurtido' })
  @ApiOperation({ summary: 'Descurtir post', description: 'Remove a curtida de um post.' })
  @ApiResponse({ status: 200, description: '[SUSR00022] Curtida removida com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00019] Curtida não encontrada.' })
  async descurtirPost(@Param('id') id: string, @Request() req: any) {
    const dados = await this.postService.descurtirPost(id, req.user.idUsuario);
    return {
      codigo: 'SUSR00022',
      mensagem: SuccessMessages.SUSR00022.mensagem,
      dados,
    };
  }

  @Get(':id/curtidas')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do post que deseja ver as curtidas' })
  @ApiOperation({ summary: 'Ver curtidas do post', description: 'Retorna o total de curtidas e a lista de usuários que curtiram o post.' })
  @ApiResponse({ status: 200, description: '[SUSR00033] Curtidas do post retornadas com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00012] Post não encontrado.' })
  async obterCurtidasPost(@Param('id') id: string) {
    const dados = await this.postService.obterCurtidasPost(id);
    return {
      codigo: 'SUSR00033',
      mensagem: SuccessMessages.SUSR00033.mensagem,
      dados,
    };
  }

  @Get('usuario/:idUsuario')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'idUsuario', description: 'ID do usuário cujos posts serão listados' })
  @ApiOperation({ summary: 'Listar posts de um usuário', description: 'Retorna todos os posts de um usuário específico, incluindo fotos. Usado na tela de perfil.' })
  @ApiResponse({ status: 200, description: '[SUSR00015] Posts do usuário retornados com sucesso.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  async findByUsuario(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    const dados = await this.postService.findByUsuario(idUsuario);
    return {
      codigo: 'SUSR00015',
      mensagem: SuccessMessages.SUSR00015.mensagem,
      dados,
    };
  }

  @Get('usuario/:idUsuario/likes')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'idUsuario', description: 'ID do usuário' })
  @ApiOperation({ summary: 'Curtidas dadas a posts de outros usuários', description: 'Retorna quantas curtidas o usuário deu em posts de outros usuários e quantos usuários distintos ele curtiu.' })
  @ApiResponse({ status: 200, description: '[SUSR00026] Estatísticas retornadas com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  async contarLikesDados(@Param('idUsuario', ParseIntPipe) idUsuario: number) {
    const dados = await this.postService.contarLikesDadosPorUsuario(idUsuario);
    return {
      codigo: 'SUSR00026',
      mensagem: SuccessMessages.SUSR00026.mensagem,
      dados,
    };
  }

  // Comentários 

  @Post(':id/comentarios')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'ID do post a ser comentado' })
  @ApiOperation({ summary: 'Comentar post', description: 'Adiciona um comentário ao post. Pode comentar no próprio post.' })
  @ApiResponse({ status: 201, description: '[SUSR00023] Comentário adicionado com sucesso.' })
  @ApiResponse({ status: 404, description: '[EUSR00012] Post não encontrado.' })
  async comentarPost(
    @Param('id') id: string,
    @Body() createComentarioDto: CreateComentarioDto,
    @Request() req: any,
  ) {
    const dados = await this.postService.comentarPost(id, req.user.idUsuario, createComentarioDto.texto);
    return {
      codigo: 'SUSR00023',
      mensagem: SuccessMessages.SUSR00023.mensagem,
      dados,
    };
  }

  @Delete('comentarios/:idComentario')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiParam({ name: 'idComentario', description: 'ID do comentário a ser removido' })
  @ApiOperation({ summary: 'Remover comentário', description: 'Remove um comentário. Apenas o autor do comentário pode removê-lo.' })
  @ApiResponse({ status: 200, description: '[SUSR00024] Comentário removido com sucesso.' })
  @ApiResponse({ status: 403, description: '[EUSR00013] Sem permissão para remover este comentário.' })
  @ApiResponse({ status: 404, description: '[EUSR00020] Comentário não encontrado.' })
  async removerComentario(@Param('idComentario') idComentario: string, @Request() req: any) {
    await this.postService.removerComentario(idComentario, req.user.idUsuario);
    return {
      codigo: 'SUSR00024',
      mensagem: SuccessMessages.SUSR00024.mensagem,
    };
  }
}
