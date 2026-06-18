import { Controller, Post, Body, Req, UnauthorizedException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GradmentService } from './gradment.service.js';
import { Public } from '../common/decorators/public.decorator.js';
import { UsuarioService } from '../aluno/usuario.service.js';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

@ApiTags('Gradment Integration')
@Controller('gradment')
export class GradmentController {
  constructor(
    private gradmentService: GradmentService,
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  @Post('integrate')
  @ApiOperation({ summary: 'Integrate CefetConnect with Gradment' })
  async integrate(@Req() req: any, @Body() body: any) {
    const usuarioId = req.user?.idUsuario;
    if (!usuarioId) {
      throw new UnauthorizedException('Usuário não autenticado no CefetConnect');
    }

    const { email, password } = body;
    if (!email || !password) {
      throw new BadRequestException('Email e senha do GradMent são obrigatórios');
    }

    const usuario = await this.usuarioService.findOne(usuarioId);
    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Get or generate CefetConnect integration token
    let cefetToken = usuario.tokenIntegracao;
    if (!cefetToken) {
      cefetToken = this.jwtService.sign(
        { sub: usuario.idUsuario, type: 'link_gradment' },
        { expiresIn: '3650d' },
      );
      await this.usuarioService.vincularGradMent(usuario.idUsuario, cefetToken);
    }

    // Call GradMent API
    const gradmentApiUrl = this.configService.get<string>('GRADMENT_API_URL', 'http://localhost:8080');
    
    try {
      const response = await fetch(`${gradmentApiUrl}/integracao/cefetconnect/login-integration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          cefetToken
        })
      });

      const data = await response.json() as any;

      if (response.ok && data.success) {
        return {
          success: true,
          message: 'Integração com GradMent realizada com sucesso!'
        };
      }

      if (!response.ok || !data.success) {
        const errorMessage = data?.error || data?.message || 'Falha na autenticação do GradMent. Verifique suas credenciais.';
        throw new UnauthorizedException(errorMessage);
      }
    } catch (e: any) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new InternalServerErrorException('Erro de comunicação com o GradMent: ' + e.message);
    }
  }

  @Public()
  @Post('login-integration')
  @ApiOperation({ summary: 'Public endpoint to receive integration requests from GradMent' })
  async loginIntegration(@Body() body: any) {
    const { email, senha, gradmentToken } = body;

    if (!email || !senha || !gradmentToken) {
      throw new BadRequestException('Parâmetros incompletos');
    }

    const usuario = await this.usuarioService.findByEmail(email);
    if (!usuario) {
      throw new UnauthorizedException('Credenciais do CefetConnect inválidas');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais do CefetConnect inválidas');
    }

    if (usuario.tokenIntegracao && usuario.tokenIntegracao !== gradmentToken) {
      throw new ConflictException('Esta conta do CefetConnect já está vinculada a outra conta do GradMent. Desconecte-a primeiro.');
    }

    // Generate CefetConnect integration token
    const cefetToken = this.jwtService.sign(
      { sub: usuario.idUsuario, type: 'link_gradment' },
      { expiresIn: '3650d' },
    );

    // Save Gradment token in the user's record
    await this.usuarioService.vincularGradMent(usuario.idUsuario, gradmentToken);

    return {
      success: true,
      cefetToken
    };
  }

  @Public()
  @Post('disconnect') // Using POST or DELETE, NestJS handles @Delete
  @ApiOperation({ summary: 'Disconnect GradMent account' })
  async disconnect(@Req() req: any, @Body() body: any) {
    let usuarioId = req.user?.idUsuario;

    if (!usuarioId) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        
        // 1. Try to verify it as a CefetConnect session token
        try {
          const payload = this.jwtService.verify(token);
          if (payload && payload.sub && payload.type !== 'link_gradment') {
            usuarioId = Number(payload.sub);
          }
        } catch (e) {
          // Token is not a valid CC session token (might be a GradMent integration token)
        }

        // 2. If still no usuarioId, try to find it as an integration token
        if (!usuarioId) {
          const usuarioByToken = await this.usuarioService.findByTokenIntegracao(token);
          if (usuarioByToken) {
            usuarioId = usuarioByToken.idUsuario;
          }
        }
      }
    }

    if (!usuarioId) {
      throw new UnauthorizedException('Usuário não autenticado no CefetConnect');
    }

    const usuario = await this.usuarioService.findOne(usuarioId);
    const gradmentToken = usuario?.tokenIntegracao;

    await this.usuarioService.vincularGradMent(usuarioId, null as any);

    const propagate = body?.propagate !== false;
    if (gradmentToken && propagate) {
      const gradmentApiUrl = this.configService.get('GRADMENT_API_URL', 'http://localhost:8080');
      try {
        await fetch(`${gradmentApiUrl}/integracao/cefetconnect/disconnect`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${gradmentToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ propagate: false })
        });
      } catch (e) {
        // Ignore failure
      }
    }

    return {
      success: true,
      message: 'Conta do GradMent desconectada com sucesso'
    };
  }
}
