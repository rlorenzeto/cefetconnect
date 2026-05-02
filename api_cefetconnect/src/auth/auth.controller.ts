import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { LoginUsuarioDto } from '../aluno/dto/login-usuario.dto.js';
import { Public } from '../common/decorators/public.decorator.js';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Realizar login', description: 'Autentica o usuário com e-mail e senha e retorna um token JWT.' })
  @ApiResponse({ status: 200, description: '[SAUT00001] Login realizado com sucesso.' })
  @ApiResponse({ status: 401, description: '[EAUT00001] Email ou senha incorretos.' })
  @ApiResponse({ status: 403, description: '[EAUT00002] E-mail não verificado. Verifique seu e-mail antes de fazer login.' })
  login(@Body() loginDto: LoginUsuarioDto) {
    return this.authService.login(loginDto);
  }
}
