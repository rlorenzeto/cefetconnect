// Códigos de erro da API CefetConnect
// Prefixo EUSR = Erro de Usuário | Prefixo EAUT = Erro de Autenticação

export const ErrorMessages = {
  // ── Usuário ──────────────────────────────────────────────────────────────
  EUSR00001: { mensagem: 'Campos incorretos enviados.', status: 400 },
  EUSR00002: { mensagem: 'Matrícula ou Email já cadastrados no sistema.', status: 409 },
  EUSR00003: { mensagem: 'Estudante não encontrado.', status: 404 },
  EUSR00004: { mensagem: 'Este e-mail já foi verificado.', status: 400 },
  EUSR00005: { mensagem: 'Código de verificação inválido.', status: 400 },
  EUSR00006: { mensagem: 'Erro ao atualizar usuário.', status: 400 },
  EUSR00007: { mensagem: 'Erro ao excluir usuário.', status: 400 },
  EUSR00008: { mensagem: 'Formato de imagem inválido.', status: 400 },
  EUSR00009: { mensagem: 'Tamanho máximo de arquivo excedido.', status: 413 },
  EUSR00010: { mensagem: 'Senha atual incorreta.', status: 401 },
  EUSR00011: { mensagem: 'Este e-mail já está em uso por outro usuário.', status: 409 },

  // ── Autenticação ──────────────────────────────────────────────────────────
  EAUT00001: { mensagem: 'Email ou senha incorretos.', status: 401 },
  EAUT00002: { mensagem: 'E-mail não verificado. Verifique seu e-mail antes de fazer login.', status: 403 },
  EAUT00003: { mensagem: 'Token inválido ou expirado.', status: 401 },
  EAUT00004: { mensagem: 'Acesso não autorizado.', status: 401 },
} as const;

export type ErrorCode = keyof typeof ErrorMessages;
