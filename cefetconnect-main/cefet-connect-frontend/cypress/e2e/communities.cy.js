describe('Feature: Gestão de Comunidades (CommunitiesPage)', () => {

  // Variável base para simular a nossa comunidade durante todo o fluxo
  const comunidadeTeste = {
    idComunidade: 100,
    nomeComunidade: "Comunidade Teste Automação",
    descricaoComunidade: "Comunidade focada em testes automatizados e frontend.",
    totalMembros: 1,
    totalPosts: 0,
    isMembro: true,
    idCriador: 1 // Mesmo ID do nosso usuário falso
  };

  beforeEach(() => {
    cy.viewport(1920, 1080);

    // Injeta o usuário autenticado
    cy.window().then((win) => {
      win.localStorage.setItem(
        "cefetconnect_user", 
        JSON.stringify({ idUsuario: 1, matricula: "12345678901", token: "fake-jwt" })
      );
    });
  });

  // ==========================================
  // CENÁRIO 1: CRIAR NOVA COMUNIDADE
  // ==========================================
  it('Cenário 1: Sucesso - Criar uma nova comunidade', () => {
    // 1. A página carrega inicialmente SEM a comunidade
    cy.intercept('GET', '**/comunidade', { statusCode: 200, body: { dados: [] } }).as('loadEmpty');
    
    cy.visit('http://localhost:5173/comunidades');
    cy.wait('@loadEmpty');
    cy.wait(1000);
    cy.intercept('POST', '**/comunidade', {
      delay: 500,
      statusCode: 201,
      body: { message: "Comunidade criada" }
    }).as('createCommunity');

    // 2. Prepara o mock para retornar a comunidade NOVA após o salvamento
    cy.intercept('GET', '**/comunidade', { 
      statusCode: 200, 
      body: { dados: [comunidadeTeste] } 
    }).as('loadWithNewCommunity');

    cy.contains('button', 'Nova comunidade').filter(':visible').click();

    cy.get('input[name="nomeComunidade"]:visible').type('Comunidade Teste Automação', { delay: 100 });
    cy.get('textarea[name="descricaoComunidade"]:visible').type('Comunidade focada em testes automatizados e frontend.', { delay: 100 });

    cy.contains('button', 'Salvar').filter(':visible').click();

    cy.wait('@createCommunity');
    cy.wait('@loadWithNewCommunity');
    cy.wait(1000);

    // Agora ela vai aparecer linda na tela!
    cy.contains('Comunidade Teste Automação').should('be.visible');
    cy.get('input[name="nomeComunidade"]').should('not.exist'); // Modal fechou
  });

  // ==========================================
  // CENÁRIO 2: ENTRAR EM COMUNIDADE
  // ==========================================
  it('Cenário 2: Sucesso - Entrar em uma comunidade existente', () => {
    // Carrega a comunidade simulando que NÃO somos membros (para o botão Entrar aparecer)
    cy.intercept('GET', '**/comunidade', { 
      statusCode: 200, 
      body: { dados: [{ ...comunidadeTeste, isMembro: false, idCriador: 99 }] } 
    }).as('loadNotMember');

    cy.visit('http://localhost:5173/comunidades');
    cy.wait('@loadNotMember');

    cy.intercept('POST', '**/comunidade/*/entrar', {
      statusCode: 200,
      body: { message: "Entrou na comunidade" }
    }).as('joinCommunity');
    cy.wait(1000);

    // Prepara o mock para atualizar a tela mostrando que agora somos membros
    cy.intercept('GET', '**/comunidade', { 
      statusCode: 200, 
      body: { dados: [{ ...comunidadeTeste, isMembro: true, idCriador: 99, totalMembros: 2 }] } 
    }).as('loadNowMember');

    cy.contains('article', 'Comunidade Teste Automação').contains('button', 'Entrar').filter(':visible').click();

    cy.wait('@joinCommunity');
    cy.wait('@loadNowMember');
    cy.wait(1000);

    // O botão deve ter mudado para Sair
    cy.contains('article', 'Comunidade Teste Automação').contains('button', 'Sair').should('be.visible');
  });

  // ==========================================
  // CENÁRIO 3: SAIR DE COMUNIDADE
  // ==========================================
  it('Cenário 3: Sucesso - Sair de uma comunidade', () => {
    cy.intercept('GET', '**/comunidade', { 
      statusCode: 200, 
      body: { dados: [{ ...comunidadeTeste, isMembro: true, idCriador: 99 }] } 
    }).as('loadIsMember');

    cy.visit('http://localhost:5173/comunidades');
    cy.wait('@loadIsMember');
    cy.wait(1000);

    cy.intercept('DELETE', '**/comunidade/*/sair', {
      statusCode: 200,
      body: { message: "Saiu da comunidade" }
    }).as('leaveCommunity');

    cy.intercept('GET', '**/comunidade', { 
      statusCode: 200, 
      body: { dados: [{ ...comunidadeTeste, isMembro: false, idCriador: 99 }] } 
    }).as('loadNotMemberAnymore');

    cy.on('window:confirm', () => true);

    // CORREÇÃO: Adicionado { force: true } para ignorar a barra lateral sobreposta
    cy.contains('article', 'Comunidade Teste Automação')
      .contains('button', 'Sair')
      .filter(':visible')
      .click({ force: true });

    cy.wait('@leaveCommunity');
    cy.wait('@loadNotMemberAnymore');
    cy.wait(1000);

    cy.contains('article', 'Comunidade Teste Automação').contains('button', 'Entrar').should('be.visible');
  });

// ==========================================
  // CENÁRIO 4: JORNADA COMPLETA DO POST NA COMUNIDADE
  // (Acessar, Criar, Curtir, Comentar, Editar Comentário, Excluir Comentário, Excluir Post)
  // ==========================================
  it('Cenário 4: Sucesso - Jornada completa de uma publicação na comunidade', () => {
    // ---------------------------------------------------------
    // FASE 1: ACESSAR A COMUNIDADE
    // ---------------------------------------------------------
    cy.intercept('GET', '**/comunidade', { statusCode: 200, body: { dados: [comunidadeTeste] } }).as('loadCommunities');
    cy.intercept('GET', '**/comunidade/100', { statusCode: 200, body: { dados: comunidadeTeste } }).as('getComunidade');
    cy.intercept('GET', '**/comunidade/100/membros', { statusCode: 200, body: { dados: [] } }).as('getMembros');
    cy.intercept('GET', '**/comunidade/100/posts', { statusCode: 200, body: { dados: [] } }).as('getPostsEmpty');
    
    // Mocks de proteção para curtidas
    cy.intercept('GET', '**/post/*/curtidas', { statusCode: 200, body: { dados: { total: 0, usuarios: [] } } }).as('loadPostLikes');
    cy.intercept('GET', '**/comentario/*/curtidas', { statusCode: 200, body: { dados: { total: 0, usuarios: [] } } }).as('loadCommentLikes');

    cy.visit('http://localhost:5173/comunidades');
    cy.wait('@loadCommunities');
    cy.wait(1000);

    cy.contains('article', 'Comunidade Teste Automação')
      .contains('button', 'Abrir')
      .filter(':visible')
      .click({ force: true });

    cy.wait(['@getComunidade', '@getPostsEmpty']);
    cy.url().should('include', '/comunidades/100');
    cy.wait(1000);

    // ---------------------------------------------------------
    // FASE 2: CRIAR O POST
    // ---------------------------------------------------------
    cy.intercept('POST', '**/post', {
      delay: 500,
      statusCode: 201,
      body: {
        dados: {
          idPost: 2000,
          conteudo: "Post exclusivo da Comunidade!",
          dataHoraPublicacao: new Date().toISOString(),
          fk_Comunidade_idComunidade: 100,
          // Reforço: idUsuario adicionado para o React nunca ter dúvidas de quem é o dono
          usuario: { idUsuario: 1, matricula: "12345678901", nomeUsuario: "Johnatan Duarte" } 
        }
      }
    }).as('createCommunityPost');

    cy.get('textarea[placeholder*="No que você está pensando"]:visible')
      .type('Post exclusivo da Comunidade!', { delay: 100 });

    cy.contains('button', 'Postar').filter(':visible').click();

    cy.wait('@createCommunityPost');
    cy.wait('@loadPostLikes');
    cy.contains('Post exclusivo da Comunidade!').should('be.visible');
    cy.wait(1000);

    // ---------------------------------------------------------
    // FASE 3: CURTIR O POST
    // ---------------------------------------------------------
    cy.intercept('POST', '**/post/*/curtir', { statusCode: 200, body: { message: "Curtido" } }).as('likePost');
    
    cy.contains('article', 'Post exclusivo da Comunidade!').dblclick();
    cy.wait('@likePost');
    cy.wait(1000);

    // ---------------------------------------------------------
    // FASE 4: COMENTAR NO POST
    // ---------------------------------------------------------
    cy.intercept('GET', '**/comentario/post/2000', { statusCode: 200, body: { dados: [] } }).as('loadComments');
    cy.intercept('POST', '**/comentario/post/2000', {
      delay: 500,
      statusCode: 201,
      body: {
        dados: {
          idComentario: 500,
          texto: "Comentário testado e aprovado!",
          // Reforço vital aqui também:
          usuario: { idUsuario: 1, matricula: "12345678901", nomeUsuario: "Johnatan Duarte" }, 
          post: { idPost: 2000 }
        }
      }
    }).as('createComment');

    cy.contains('article', 'Post exclusivo da Comunidade!')
      .contains('button', 'Mostrar comentários')
      .click({ force: true });
    
    cy.wait('@loadComments');

    cy.get('input[placeholder="Escreva um comentário..."]:visible').first().type('Comentário testado e aprovado!', { delay: 100 });
    cy.contains('button', 'Comentar').filter(':visible').click();
    
    cy.wait('@createComment');
    cy.wait('@loadCommentLikes');
    cy.contains('Comentário testado e aprovado!').should('be.visible');
    cy.wait(1000);

    // ---------------------------------------------------------
    // FASE 5: EDITAR O COMENTÁRIO
    // ---------------------------------------------------------
    cy.intercept('PATCH', '**/comentario/500', { statusCode: 200, body: { message: "Atualizado" } }).as('updateComment');
    
    // Pegando de forma infalível o artigo específico do comentário (pela cor de fundo dele)
    cy.contains('article.bg-\\[\\#f7f7f7\\]', 'Comentário testado e aprovado!')
      .find('button')
      .contains('Editar')
      .click({ force: true });
    
    cy.get('textarea:visible').last().clear().type('Comentário editado com SUCESSO!', { delay: 100 });
    cy.contains('button', 'Salvar').filter(':visible').click({ force: true });
    
    cy.wait('@updateComment');
    cy.contains('Comentário editado com SUCESSO!').should('be.visible');
    cy.wait(1000);

    // ---------------------------------------------------------
    // FASE 6: EXCLUIR O COMENTÁRIO
    // ---------------------------------------------------------
    cy.intercept('DELETE', '**/comentario/500', { statusCode: 200, body: { message: "Excluído" } }).as('deleteComment');
    cy.on('window:confirm', () => true);

    cy.contains('article.bg-\\[\\#f7f7f7\\]', 'Comentário editado com SUCESSO!')
      .find('button')
      .contains('Excluir')
      .click({ force: true });

    cy.wait('@deleteComment');
    cy.contains('Comentário editado com SUCESSO!').should('not.exist');
    cy.wait(1000);

    // ---------------------------------------------------------
    // FASE 7: EXCLUIR O POST DA COMUNIDADE
    // ---------------------------------------------------------
    cy.intercept('DELETE', '**/post/2000', { statusCode: 200, body: { message: "Excluído" } }).as('deletePost');

    // Usando .within para focar no post e ignorar o resto da tela
    cy.contains('article', 'Post exclusivo da Comunidade!')
      .within(() => {
        cy.contains('button', '⋯').click({ force: true });
        cy.contains('button', 'Excluir').click({ force: true });
      });

    cy.get('.z-\\[1000\\]').contains('button', 'Excluir').click({ force: true });

    cy.wait('@deletePost');
    cy.wait(1000);
    cy.contains('Post exclusivo da Comunidade!').should('not.exist');
  });

  // ==========================================
  // CENÁRIO 5: EDITAR COMUNIDADE
  // ==========================================
  it('Cenário 5: Sucesso - Editar uma comunidade', () => {
    cy.intercept('GET', '**/comunidade', { statusCode: 200, body: { dados: [comunidadeTeste] } }).as('loadCommunities');
    
    cy.visit('http://localhost:5173/comunidades');
    cy.wait('@loadCommunities');
    cy.wait(1000);

    cy.intercept('PATCH', '**/comunidade/*', { statusCode: 200, body: { message: "Atualizada" } }).as('updateCommunity');
    
    // Mock da lista atualizada com o novo nome
    cy.intercept('GET', '**/comunidade', { 
      statusCode: 200, 
      body: { dados: [{ ...comunidadeTeste, nomeComunidade: "Comunidade Editada" }] } 
    }).as('loadEdited');

    cy.contains('article', 'Comunidade Teste Automação').contains('button', 'Editar').filter(':visible').click();

    cy.get('input[name="nomeComunidade"]:visible').clear().type('Comunidade Editada', { delay: 100 });
    cy.contains('button', 'Salvar').filter(':visible').click();

    cy.wait('@updateCommunity');
    cy.wait('@loadEdited');
    cy.wait(1000);

    cy.contains('Comunidade Editada').should('be.visible');
  });

  // ==========================================
  // CENÁRIO 6: EXCLUIR COMUNIDADE
  // ==========================================
  it('Cenário 6: Sucesso - Excluir uma comunidade', () => {
    // Vamos usar a comunidade "Editada" para fazer sentido cronológico
    const comunidadeExcluir = { ...comunidadeTeste, nomeComunidade: "Comunidade Editada" };
    
    cy.intercept('GET', '**/comunidade', { statusCode: 200, body: { dados: [comunidadeExcluir] } }).as('loadCommunities');
    
    cy.visit('http://localhost:5173/comunidades');
    cy.wait('@loadCommunities');
    cy.wait(1000);

    cy.intercept('DELETE', '**/comunidade/*', { statusCode: 200, body: { message: "Excluída" } }).as('deleteCommunity');
    
    // Mock simulando que a lista agora está vazia após a exclusão
    cy.intercept('GET', '**/comunidade', { statusCode: 200, body: { dados: [] } }).as('loadEmptyAfterDelete');

    cy.on('window:confirm', () => true);

    cy.contains('article', 'Comunidade Editada').contains('button', 'Excluir').filter(':visible').click();

    cy.wait('@deleteCommunity');
    cy.wait('@loadEmptyAfterDelete');
    cy.wait(1000);

    // A comunidade finalmente some da tela, completando o ciclo!
    cy.contains('Comunidade Editada').should('not.exist');
  });

});