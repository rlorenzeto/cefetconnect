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
  EUSR00012: { mensagem: 'Post não encontrado.', status: 404 },
  EUSR00013: { mensagem: 'Você não tem permissão para acessar este recurso.', status: 403 },
  EUSR00014: { mensagem: 'Post não encontrado.', status: 404 },
  EUSR00015: { mensagem: 'Foto não encontrada.', status: 404 },
  EUSR00016: { mensagem: 'Apenas quem enviou a foto pode deletá-la.', status: 403 },
  EUSR00017: { mensagem: 'Esta foto não pertence a este post.', status: 403 },
  EUSR00018: { mensagem: 'Você já curtiu este post.', status: 409 },
  EUSR00019: { mensagem: 'Curtida não encontrada.', status: 404 },
  EUSR00020: { mensagem: 'Comentário não encontrado.', status: 404 },
  EUSR00021: { mensagem: 'Você já curtiu este comentário.', status: 409 },
  EUSR00022: { mensagem: 'Curtida de comentário não encontrada.', status: 404 },

  // ── Comunidade ──────────────────────────────────────────────────────────────
  ECOM00001: { mensagem: 'Comunidade não encontrada.', status: 404 },
  ECOM00002: { mensagem: 'Você não tem permissão para modificar esta comunidade.', status: 403 },
  ECOM00003: { mensagem: 'Você não é membro desta comunidade.', status: 403 },
  ECOM00004: { mensagem: 'Você já é membro desta comunidade.', status: 409 },
  ECOM00005: { mensagem: 'Você não é membro desta comunidade.', status: 404 },

  // ── Evento ──────────────────────────────────────────────────────────────────
  EEVT00001: { mensagem: 'Evento não encontrado.', status: 404 },
  EEVT00002: { mensagem: 'Você não tem permissão para modificar este evento.', status: 403 },
  EEVT00003: { mensagem: 'Você já está participando deste evento.', status: 409 },
  EEVT00004: { mensagem: 'Você não está participando deste evento.', status: 404 },
  EEVT00005: { mensagem: 'Você precisa ser membro da comunidade para participar deste evento.', status: 403 },

  // ── Pin ────────────────────────────────────────────────────────────────────
  EPIN00001: { mensagem: 'Pin não encontrado.', status: 404 },
  EPIN00002: { mensagem: 'Você não tem permissão para modificar este pin.', status: 403 },
  EPIN00003: { mensagem: 'Você já possui um pin com este nome no seu perfil.', status: 409 },
  EPIN00004: { mensagem: 'Este pin já está relacionado a esta comunidade.', status: 409 },
  EPIN00005: { mensagem: 'Relacionamento pin-comunidade não encontrado.', status: 404 },

  // ── Autenticação ──────────────────────────────────────────────────────────
  EAUT00001: { mensagem: 'Email ou senha incorretos.', status: 401 },
  EAUT00002: { mensagem: 'E-mail não verificado. Verifique seu e-mail antes de fazer login.', status: 403 },
  EAUT00003: { mensagem: 'Token inválido ou expirado.', status: 401 },
  EAUT00004: { mensagem: 'Acesso não autorizado.', status: 401 },
} as const;

export type ErrorCode = keyof typeof ErrorMessages;
