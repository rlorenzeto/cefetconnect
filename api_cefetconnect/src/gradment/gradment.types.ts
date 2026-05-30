export interface GradmentTokenResponse { 
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string[];
}

export interface GradmentUsuario {
  id: number;
  nome: string;
  email: string;
  faculdade_id: number;
  curso_id: number;
}

export interface GradmentMateria {
  materia_id: number;
  codigo: string;
  nome: string;
  media_final: number;
  status: string;
  aprovado_em: string;
}

export interface GradmentMateriasResponse {
  user_id: number;
  updated_at: string;
  materias_aprovadas: GradmentMateria[];
}

export interface GradmentDadosUsuario {
  usuario: GradmentUsuario;
  sessionToken: string;
}
