import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuarioService } from '../aluno/usuario.service.js';
import { LoginUsuarioDto } from '../aluno/dto/login-usuario.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginUsuarioDto) {
    const usuario = await this.usuarioService.findByEmail(loginDto.email);
    
    if (!usuario) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    //Compara a senha que o aluno digitou com o salvo no banco
    const senhaValida = await bcrypt.compare(loginDto.senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException('Email ou senha incorretos.');
    }

    // Se o usuário e a senha estiverem corretos, gera o token JWT
    const payload = { email: usuario.email, sub: usuario.matricula };
    
    // Devolve o Token gerado e alguns dados básicos para o frontend exibir na tela
    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        matricula: usuario.matricula,
        nomeUsuario: usuario.nomeUsuario,
        email: usuario.email
      }
    };
  }
}
