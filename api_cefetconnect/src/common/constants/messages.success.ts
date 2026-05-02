// Códigos de sucesso da API CefetConnect
// Prefixo SUSR = Sucesso de Usuário | Prefixo SAUT = Sucesso de Autenticação

export const SuccessMessages = {
  // ── Usuário ──────────────────────────────────────────────────────────────
  SUSR00001: { mensagem: 'Usuário cadastrado com sucesso.', status: 201 },
  SUSR00002: { mensagem: 'Usuário atualizado com sucesso.', status: 200 },
  SUSR00003: { mensagem: 'Usuário excluído com sucesso.', status: 200 },
  SUSR00004: { mensagem: 'Usuário localizado com sucesso.', status: 200 },
  SUSR00005: { mensagem: 'Lista de usuários retornada com sucesso.', status: 200 },
  SUSR00006: { mensagem: 'E-mail verificado com sucesso.', status: 200 },
  SUSR00007: { mensagem: 'Novo código de verificação enviado para o e-mail cadastrado.', status: 200 },

  // ── Autenticação ──────────────────────────────────────────────────────────
  SAUT00001: { mensagem: 'Login realizado com sucesso.', status: 200 },
  SAUT00002: { mensagem: 'Logout realizado com sucesso.', status: 200 },
} as const;

export type SuccessCode = keyof typeof SuccessMessages;
