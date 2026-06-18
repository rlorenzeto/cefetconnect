import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuarioService } from '../aluno/usuario.service.js';
import { LoginUsuarioDto } from '../aluno/dto/login-usuario.dto.js';
import { ErrorMessages } from '../common/constants/messages.errors.js';
import { GradmentService } from '../gradment/gradment.service.js';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private gradmentService: GradmentService,
  ) {}

  async login(loginDto: LoginUsuarioDto) {
    let usuario;

    if (loginDto.ssoToken) {
      try {
        const decoded = this.jwtService.verify(loginDto.ssoToken);
        if (decoded.type !== 'link_gradment') {
           throw new UnauthorizedException('SSO Token inválido.');
        }
        usuario = await this.usuarioService.findOne(decoded.sub);
        if (!usuario) throw new UnauthorizedException('Usuário não encontrado.');
      } catch (err) {
        throw new UnauthorizedException('SSO Token inválido ou expirado.');
      }
    } else {
      if (!loginDto.email || !loginDto.senha) {
         throw new UnauthorizedException('Email e senha são obrigatórios.');
      }
      usuario = await this.usuarioService.findByEmail(loginDto.email);

      if (!usuario) {
        throw new UnauthorizedException(ErrorMessages.EAUT00001.mensagem);
      }

      // Compara a senha que o aluno digitou com o salvo no banco
      const senhaValida = await bcrypt.compare(loginDto.senha, usuario.senha);

      if (!senhaValida) {
        throw new UnauthorizedException(ErrorMessages.EAUT00001.mensagem);
      }
    }

    if (!usuario.emailVerificado) {
      throw new ForbiddenException(ErrorMessages.EAUT00002.mensagem);
    }

    // 1. Gera o access_token normal do sistema (curta duração)
    const payload = { email: usuario.email, sub: usuario.idUsuario };
    const accessToken = this.jwtService.sign(payload);

    // 2. GERA O TOKEN DE INTEGRAÇÃO (longa duração, representa o usuário no GradMent)
    // Esse token serve como a chave de ligação entre as duas contas
    const tokenIntegracao = this.jwtService.sign(
      { sub: usuario.idUsuario, type: 'link_gradment' },
      { expiresIn: '3650d' }, // Validade longa de 10 anos
    );

    // 3. Busca dados do Gradment de forma não bloqueante
    // Se o Gradment estiver fora do ar ou não configurado, o login continua normalmente
    const gradmentDados = await this.gradmentService.buscarDadosUsuario(
      usuario.email,
    );

    // 4. Devolve os DOIS Tokens e alguns dados básicos para o frontend
    return {
      access_token: accessToken,
      token_integracao: tokenIntegracao, // <-- Novo token enviado para o frontend
      usuario: {
        idUsuario: usuario.idUsuario,
        matricula: usuario.matricula,
        nomeUsuario: usuario.nomeUsuario,
        email: usuario.email,
        fotoUrl: usuario.fotoUrl ?? null,
        ...(gradmentDados && {
          // Se os dados do Gradment foram encontrados, inclui-os no response
          gradment: {
            id: gradmentDados.usuario.id,
            cursoId: gradmentDados.usuario.curso_id,
            faculdadeId: gradmentDados.usuario.faculdade_id,
          },
        }),
      },
    };
  }
}
