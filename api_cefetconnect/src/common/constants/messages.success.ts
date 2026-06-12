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
  SUSR00008: { mensagem: 'Senha alterada com sucesso.', status: 200 },
  SUSR00009: { mensagem: 'E-mail alterado com sucesso. Verifique seu novo e-mail para ativar a conta.', status: 200 },
  SUSR00010: { mensagem: 'Código de recuperação enviado com sucesso.', status: 200 },
  SUSR00011: { mensagem: 'Senha recuperada com sucesso.', status: 200 },
  SUSR00012: { mensagem: 'Post criado com sucesso.', status: 201 },
  SUSR00013: { mensagem: 'Post atualizado com sucesso.', status: 200 },
  SUSR00014: { mensagem: 'Post excluído com sucesso.', status: 200 },
  SUSR00015: { mensagem: 'Posts do usuário retornados com sucesso.', status: 200 },
  SUSR00016: { mensagem: 'Post atualizado com sucesso.', status: 200 },
  SUSR00017: { mensagem: 'Post deletado com sucesso.', status: 200 },
  SUSR00018: { mensagem: 'Fotos adicionadas com sucesso.', status: 201 },
  SUSR00019: { mensagem: 'Fotos retornadas com sucesso.', status: 200 },
  SUSR00020: { mensagem: 'Foto deletada com sucesso.', status: 200 },
  SUSR00021: { mensagem: 'Post curtido com sucesso.', status: 200 },
  SUSR00022: { mensagem: 'Curtida removida com sucesso.', status: 200 },
  SUSR00023: { mensagem: 'Comentário adicionado com sucesso.', status: 201 },
  SUSR00024: { mensagem: 'Comentário removido com sucesso.', status: 200 },
  SUSR00025: { mensagem: 'Foto(s) removidas com sucesso.', status: 200 },
  SUSR00026: { mensagem: 'Estatísticas de curtidas retornadas com sucesso.', status: 200 },
  SUSR00027: { mensagem: 'Comentário curtido com sucesso.', status: 200 },
  SUSR00028: { mensagem: 'Curtida de comentário removida com sucesso.', status: 200 },
  SUSR00029: { mensagem: 'Comentários retornados com sucesso.', status: 200 },
  SUSR00030: { mensagem: 'Comentário retornado com sucesso.', status: 200 },
  SUSR00031: { mensagem: 'Curtidas do comentário retornadas com sucesso.', status: 200 },
  SUSR00032: { mensagem: 'Comentário atualizado com sucesso.', status: 200 },
  SUSR00033: { mensagem: 'Curtidas do post retornadas com sucesso.', status: 200 },

  // ── Comunidade ────────────────────────────────────────────────────────────
  SCOM00001: { mensagem: 'Comunidade criada com sucesso.', status: 201 },
  SCOM00002: { mensagem: 'Comunidade retornada com sucesso', status: 200},
  SCOM00003: { mensagem: 'Você entrou na comunidade com sucesso.', status: 200 },
  SCOM00004: { mensagem: 'Você saiu da comunidade com sucesso.', status: 200 },
  SCOM00005: { mensagem: 'Comunidade atualizada com sucesso.', status: 200 },
  SCOM00006: { mensagem: 'Comunidade excluída com sucesso.', status: 200 },
  SCOM00007: { mensagem: 'Comunidades retornadas com sucesso.', status: 200 },
  SCOM00008: { mensagem: 'Comunidade não encontrada.', status: 404 },
  SCOM00009: { mensagem: 'Você não tem autorização para deletar essa comunidade.', status: 403 },
  SCOM00010: { mensagem: 'Eventos da comunidade retornados com sucesso.', status: 200 },
  SCOM00011: { mensagem: 'Membros da comunidade retornados com sucesso.', status: 200 },
  SCOM00012: { mensagem: 'Comunidades da disciplina retornadas com sucesso.', status: 200 },

  // ── Evento ────────────────────────────────────────────────────────────────
  SEVT00001: { mensagem: 'Evento criado com sucesso.', status: 201 },
  SEVT00002: { mensagem: 'Eventos retornados com sucesso.', status: 200 },
  SEVT00003: { mensagem: 'Evento atualizado com sucesso.', status: 200 },
  SEVT00004: { mensagem: 'Evento excluído com sucesso.', status: 200 },
  SEVT00005: { mensagem: 'Eventos do usuário retornados com sucesso.', status: 200 },
  SEVT00006: { mensagem: 'Você está participando do evento.', status: 200 },
  SEVT00007: { mensagem: 'Você saiu do evento com sucesso.', status: 200 },
  SEVT00008: { mensagem: 'Participação desconfirmada com sucesso.', status: 200 },

  // ── Pin ───────────────────────────────────────────────────────────────────
  SPIN00001: { mensagem: 'Pin adicionado com sucesso.', status: 201 },
  SPIN00002: { mensagem: 'Pins retornados com sucesso.', status: 200 },
  SPIN00003: { mensagem: 'Pin atualizado com sucesso.', status: 200 },
  SPIN00004: { mensagem: 'Pin removido com sucesso.', status: 200 },
  SPIN00005: { mensagem: 'Pins importados do Gradment com sucesso.', status: 201 },
  SPIN00006: { mensagem: 'Sugestões de pins geradas com sucesso.', status: 200 },
  SPIN00007: { mensagem: 'Detalhes do pin retornados com sucesso.', status: 200 },
  SPIN00008: { mensagem: 'Usuários relacionados ao pin retornados com sucesso.', status: 200 },
  SPIN00009: { mensagem: 'Comunidades relacionadas ao pin retornadas com sucesso.', status: 200 },
  SPIN00010: { mensagem: 'Pin relacionado à comunidade com sucesso.', status: 200 },
  SPIN00011: { mensagem: 'Relacionamento pin-comunidade removido com sucesso.', status: 200 },
  SPIN00012: { mensagem: 'Pins disponíveis retornados com sucesso.', status: 200},
  SPIN00013: {mensagem: 'Pins da comunidade retornados com sucesso.', status: 200},

  // ── Ícone ─────────────────────────────────────────────────────────────────
  SICO00001: { mensagem: 'ícone(s) importado(s) com sucesso.', status: 200 },
  SICO00002: { mensagem: 'Nenhum ícone novo encontrado.', status: 200 },
  SICO00003: { mensagem: 'Ícones retornados com sucesso.', status: 200 },
  SICO00004: { mensagem: 'Ícones do usuário retornados com sucesso.', status: 200 },

  // ── Busca ─────────────────────────────────────────────────────────────────
  SBSC00001: { mensagem: 'Busca realizada com sucesso.', status: 200 },

  // ── Ranking ───────────────────────────────────────────────────────────────
  SRAN00001: { mensagem: 'Preview do ranking retornado com sucesso.', status: 200 },
  SRAN00002: { mensagem: 'Ranking completo retornado com sucesso.', status: 200 },

  // ── Autenticação ──────────────────────────────────────────────────────────
  SAUT00001: { mensagem: 'Login realizado com sucesso.', status: 200 },
  SAUT00002: { mensagem: 'Logout realizado com sucesso.', status: 200 },
} as const;

export type SuccessCode = keyof typeof SuccessMessages;
