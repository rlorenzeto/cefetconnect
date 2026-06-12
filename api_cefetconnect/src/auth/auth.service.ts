import { Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsuarioService } from '../aluno/usuario.service.js';
import { LoginUsuarioDto } from '../aluno/dto/login-usuario.dto.js';
import { ErrorMessages } from '../common/constants/messages.errors.js';
import { GradmentService } from '../gradment/gradment.service.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity.js';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private gradmentService: GradmentService,
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async login(loginDto: LoginUsuarioDto) { //Recebe os dados do login do aluno
    const usuario = await this.usuarioService.findByEmail(loginDto.email);
    
    if (!usuario) {
      throw new UnauthorizedException(ErrorMessages.EAUT00001.mensagem);
    }

    //Compara a senha que o aluno digitou com o salvo no banco
    const senhaValida = await bcrypt.compare(loginDto.senha, usuario.senha);

    if (!senhaValida) {
      throw new UnauthorizedException(ErrorMessages.EAUT00001.mensagem);
    }

    if (!usuario.emailVerificado) {
      throw new ForbiddenException(ErrorMessages.EAUT00002.mensagem);
    }

    // Se o usuário e a senha estiverem corretos, gera o token JWT
    const payload = { email: usuario.email, sub: usuario.idUsuario };

    // 1. Gera o access_token normal do sistema (curta duração)
    const accessToken = this.jwtService.sign(payload);

    // 2. Gera o token de integração (longa duração, representa o usuário)
    // Esse token vai ser guardado pelo Gradment para linkar as contas
    const tokenIntegracao = this.jwtService.sign(
      { sub: usuario.idUsuario, type: 'link_gradment' },
      { expiresIn: '365d' },
    );

    // 3. Se o Gradment enviou o token deles, salva no usuário
    if (loginDto.tokenGradment) {
      await this.usuarioRepository.update(
        { idUsuario: usuario.idUsuario },
        { tokenIntegracao: loginDto.tokenGradment },
      );
    }

    // Busca dados do Gradment de forma não bloqueante
    // Se o Gradment estiver fora do ar ou não configurado, o login continua normalmente
    const gradmentDados = await this.gradmentService.buscarDadosUsuario(usuario.email);

    // Devolve o Token gerado e alguns dados básicos para o frontend exibir na tela
    return {
      access_token: accessToken,
      token_integracao: tokenIntegracao,
      usuario: {
        idUsuario: usuario.idUsuario,
        matricula: usuario.matricula,
        nomeUsuario: usuario.nomeUsuario,
        email: usuario.email,
        fotoUrl: usuario.fotoUrl ?? null,
        ...(gradmentDados && { // Se os dados do Gradment foram encontrados, inclui-os no response
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
