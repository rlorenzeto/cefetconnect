import { Controller, HttpCode, HttpStatus, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { LoginUsuarioDto } from '../aluno/dto/login-usuario.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Quando o Login dá certo, status 200 (OK)
  @HttpCode(HttpStatus.OK) 
  @Post('login') 
  login(@Body() loginDto: LoginUsuarioDto) {
    return this.authService.login(loginDto);
  }
}
