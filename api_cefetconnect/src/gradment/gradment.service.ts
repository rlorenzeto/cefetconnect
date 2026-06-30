import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GradmentDadosUsuario,
  GradmentMateria,
  GradmentTokenResponse,
  GradmentUsuario,
} from './gradment.types';

@Injectable()
export class GradmentService {
  // Logger para registrar eventos e erros
  private readonly logger = new Logger(GradmentService.name);
  // URL base da API do Gradment
  private readonly baseUrl: string;
  // Token de integração para autenticação
  private readonly integrationToken: string;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('GRADMENT_BASE_URL', '');
    this.integrationToken = this.configService.get<string>('GRADMENT_INTEGRATION_TOKEN', '');
  }

  // verifica se o .env foi configurado corretamente. 
  private isConfigurado(): boolean {
    return Boolean(this.baseUrl && this.integrationToken); 
  }

  // consome a rota POST /api/integracao/auth/login, enviando o integration_token e o email no body, 
  // e recuperando o access_token para as chamadas seguintes.
  async obterTokenSessao(email: string, externalUserId?: string): Promise<string | null> {
    if (!this.isConfigurado()) return null;

    try {
      const response = await fetch(`${this.baseUrl}/api/integracao/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          integration_token: this.integrationToken, // serve pro gradment identificar que o pedido vem de uma origem autorizada.
          email, // email do estudante em questao
          ...(externalUserId && { external_user_id: externalUserId }), // id externo do estudante (opcional)
        }),
      });

      // verifica se a requisição foi bem-sucedida
      if (!response.ok) {
        this.logger.warn(`[Gradment] Falha ao obter token para ${email}: HTTP ${response.status}`);
        return null;
      }

      const data = await response.json() as GradmentTokenResponse;
      return data.access_token ?? null;
    } catch (e) {
      this.logger.error(`[Gradment] Erro de conexão em obterTokenSessao: ${e}`);
      return null;
    }
  }

  // usa o token de sessão para buscar os dados do usuário no Gradment
  async obterUsuario(sessionToken: string): Promise<GradmentUsuario | null> {
    if (!this.isConfigurado()) return null; 

    try {
      const response = await fetch(`${this.baseUrl}/api/integracao/me`, {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });

      if (!response.ok) {
        this.logger.warn(`[Gradment] Falha em /me: HTTP ${response.status}`);
        return null;
      }

      return await response.json() as GradmentUsuario;
    } catch (e) {
      this.logger.error(`[Gradment] Erro de conexão em obterUsuario: ${e}`);
      return null;
    }
  }

  // Busca as matérias em que o usuário foi aprovado
  // updatedSince filtra apenas atualizações após uma data (ex: "2026-05-28T00:00:00Z")
  async obterMateriasAprovadas(
    userId: string | number,
    sessionToken: string,
    updatedSince?: string,
  ): Promise<{ materias: GradmentMateria[]; resumo?: any }> {
    if (!this.isConfigurado()) return { materias: [] };

    try {
      const url = new URL(`${this.baseUrl}/api/integracao/users/${userId}/materias-aprovadas`);
      if (updatedSince) url.searchParams.set('updated_since', updatedSince);

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });

      if (!response.ok) {
        this.logger.warn(`[Gradment] Falha em matérias do usuário ${userId}: HTTP ${response.status}`);
        return { materias: [] };
      }

      const data = await response.json() as any;

      // aceita tanto o formato do PDF quanto o do simulado do WhatsApp
      if (data.dados && data.dados.materias_aprovadas) {
        return {
          materias: data.dados.materias_aprovadas,
          resumo: data.dados.resumo ?? null,
        };
      }

      return {
        materias: data.materias_aprovadas ?? [],
        resumo: data.resumo ?? null,
      };
    } catch (e) {
      this.logger.error(`[Gradment] Erro de conexão em obterMateriasAprovadas: ${e}`);
      return { materias: [] };
    }
  }

  // Busca os eixos/matérias aprovadas do usuário usando o token de integração do Gradment
  // O tokenIntegracao é o token que o Gradment nos forneceu e está salvo no campo token_integracao do usuário
  async obterEixosCompletados(tokenIntegracao: string): Promise<any> {
    if (!this.baseUrl) {
      return {
        curso: null,
        materias: [],
        eixosFinalizados: [],
        periodosFinalizados: [],
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/integracao/conquistas`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenIntegracao}`,
        },
      });

      if (!response.ok) {
        this.logger.warn(
          `[Gradment] obterEixosCompletados falhou: HTTP ${response.status}`,
        );

        return {
          curso: null,
          materias: [],
          eixosFinalizados: [],
          periodosFinalizados: [],
        };
      }

      const data = (await response.json()) as any;
      const payload = data.dados ?? data;

      const materias =
        payload.materias_aprovadas ??
        payload.materiasAprovadas ??
        payload.materias ??
        [];

      const eixosFinalizados =
        payload.eixosFinalizados ??
        payload.eixos_finalizados ??
        payload.eixos ??
        [];

      const periodosFinalizados =
        payload.periodosFinalizados ??
        payload.periodos_finalizados ??
        payload.periodos ??
        [];

      const curso =
        payload.curso ??
        payload.usuario?.curso ??
        payload.resumo?.curso ??
        null;

      return {
        curso,
        materias,
        eixosFinalizados,
        periodosFinalizados,
        resumo: payload.resumo ?? null,
      };
    } catch (e) {
      this.logger.error(`[Gradment] Erro em obterEixosCompletados: ${e}`);

      return {
        curso: null,
        materias: [],
        eixosFinalizados: [],
        periodosFinalizados: [],
      };
    }
  }

  // Método de conveniência: executa o fluxo completo (token + dados do usuário + matérias atualizadas)
  async buscarDadosUsuario(email: string): Promise<GradmentDadosUsuario | null> {
    const sessionToken = await this.obterTokenSessao(email);
    if (!sessionToken) return null;

    const usuario = await this.obterUsuario(sessionToken);
    if (!usuario) return null;

    // Puxa as matérias já contemplando as novas propriedades de eixo e período enviadas no JSON
    const resultadoMaterias = await this.obterMateriasAprovadas(usuario.id, sessionToken);

    return { 
      usuario, 
      sessionToken,
      materiasAprovadas: resultadoMaterias.materias,
      resumoAcademico: resultadoMaterias.resumo, // Injeta o resumo novo no login do Cefet Connect
    };
  }
}