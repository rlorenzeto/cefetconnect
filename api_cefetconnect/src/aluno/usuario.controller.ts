import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsuarioService } from './usuario.service.js';
import { CreateUsuarioDto } from './dto/create-usuario.dto.js';
import { UpdateUsuarioDto } from './dto/update-usuario.dto.js';
import { VerificarEmailDto } from './dto/verificar-email.dto.js';
import { multerPerfilConfig } from '../uploads/multer.config.js';
import { SuccessMessages } from '../common/constants/messages.success.js';
import { Public } from '../common/decorators/public.decorator.js';
import { AlterarEmailDto } from './dto/alterar-email.dto.js';
import { AlterarSenhaDto } from './dto/alterar-senha.dto.js';

@ApiTags('Usuários')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Cadastrar usuário', description: 'Cria um novo usuário no sistema e envia um código de verificação por e-mail.' })
  @ApiResponse({ status: 201, description: '[SUSR00001] Usuário cadastrado com sucesso.' })
  @ApiResponse({ status: 400, description: '[EUSR00001] Campos incorretos enviados.' })
  @ApiResponse({ status: 409, description: '[EUSR00002] Matrícula ou Email já cadastrados no sistema.' })
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    const dados = await this.usuarioService.create(createUsuarioDto);
    return {
      codigo: 'SUSR00001',
      mensagem: SuccessMessages.SUSR00001.mensagem,
      dados,
    };
  }

  @Post(':id/verificar-email')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verificar e-mail', description: 'Confirma o e-mail do usuário a partir do código recebido.' })
  @ApiParam({ name: 'id', description: 'Matrícula do usuário' })
  @ApiResponse({ status: 200, description: '[SUSR00006] E-mail verificado com sucesso.' })
  @ApiResponse({ status: 400, description: '[EUSR00004] E-mail já verificado. | [EUSR00005] Código de verificação inválido.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  verificarEmail(@Param('id') id: string, @Body() body: VerificarEmailDto) {
    return this.usuarioService.verificarEmail(id, body.codigo);
  }

  @Post(':id/reenviar-codigo')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reenviar código de verificação', description: 'Gera e envia um novo código de verificação para o e-mail do usuário.' })
  @ApiParam({ name: 'id', description: 'Matrícula do usuário' })
  @ApiResponse({ status: 200, description: '[SUSR00007] Novo código de verificação enviado para o e-mail cadastrado.' })
  @ApiResponse({ status: 400, description: '[EUSR00004] E-mail já verificado.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  reenviarCodigo(@Param('id') id: string) {
    return this.usuarioService.reenviarCodigo(id);
  }

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todos os usuários', description: 'Retorna a lista de todos os usuários cadastrados. Requer autenticação.' })
  @ApiResponse({ status: 200, description: '[SUSR00005] Lista de usuários retornada com sucesso.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  async findAll() {
    const dados = await this.usuarioService.findAll();
    return {
      codigo: 'SUSR00005',
      mensagem: SuccessMessages.SUSR00005.mensagem,
      dados,
    };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar usuário por matrícula', description: 'Retorna os dados de um usuário pelo número de matrícula. Requer autenticação.' })
  @ApiParam({ name: 'id', description: 'Matrícula do usuário' })
  @ApiResponse({ status: 200, description: '[SUSR00004] Usuário localizado com sucesso.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  async findOne(@Param('id') id: string) {
    const dados = await this.usuarioService.findOne(id);
    return {
      codigo: 'SUSR00004',
      mensagem: SuccessMessages.SUSR00004.mensagem,
      dados,
    };
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor('fotoUrl', multerPerfilConfig))
  @ApiOperation({ summary: 'Atualizar usuário', description: 'Atualiza os dados de um usuário. Permite envio de foto de perfil (multipart/form-data). Requer autenticação.' })
  @ApiParam({ name: 'id', description: 'Matrícula do usuário' })
  @ApiResponse({ status: 200, description: '[SUSR00002] Usuário atualizado com sucesso.' })
  @ApiResponse({ status: 400, description: '[EUSR00001] Campos incorretos enviados.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  @ApiResponse({ status: 413, description: '[EUSR00009] Tamanho máximo de arquivo excedido (5MB).' })
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })],
        fileIsRequired: false,
      }),
    )
    fotoUrl?: Express.Multer.File,
  ) {
    const dados = await this.usuarioService.update(
      id,
      updateUsuarioDto,
      fotoUrl,
    );
    return {
      codigo: 'SUSR00002',
      mensagem: SuccessMessages.SUSR00002.mensagem,
      dados,
    };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir usuário', description: 'Remove permanentemente um usuário do sistema. Requer autenticação.' })
  @ApiParam({ name: 'id', description: 'Matrícula do usuário' })
  @ApiResponse({ status: 200, description: '[SUSR00003] Usuário excluído com sucesso.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  async remove(@Param('id') id: string) {
    await this.usuarioService.remove(id);
    return {
      codigo: 'SUSR00003',
      mensagem: SuccessMessages.SUSR00003.mensagem,
    };
  }

  @Patch(':id/alterar-senha')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alterar senha', description: 'Altera a senha do usuário. Exige a senha atual para confirmar a operação.' })
  @ApiParam({ name: 'id', description: 'Matrícula do usuário' })
  @ApiResponse({ status: 200, description: '[SUSR00008] Senha alterada com sucesso.' })
  @ApiResponse({ status: 400, description: '[EUSR00010] Senha atual incorreta.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  async alterarSenha(@Param('id') id: string, @Body() dto: AlterarSenhaDto) {
    return this.usuarioService.alterarSenha(id, dto);
  }

  @Patch(':id/alterar-email')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Alterar e-mail', description: 'Altera o e-mail do usuário. Exige a senha atual para confirmar. O novo e-mail deverá ser verificado antes do próximo login.' })
  @ApiParam({ name: 'id', description: 'Matrícula do usuário' })
  @ApiResponse({ status: 200, description: '[SUSR00009] E-mail alterado com sucesso. Verifique seu novo e-mail para ativar a conta.' })
  @ApiResponse({ status: 400, description: '[EUSR00010] Senha atual incorreta.' })
  @ApiResponse({ status: 401, description: '[EAUT00003] Token inválido ou expirado.' })
  @ApiResponse({ status: 404, description: '[EUSR00003] Estudante não encontrado.' })
  @ApiResponse({ status: 409, description: '[EUSR00011] E-mail já está em uso por outro usuário.' })
  async alterarEmail(@Param('id') id: string, @Body() dto: AlterarEmailDto) {
    return this.usuarioService.alterarEmail(id, dto);
  }
}
