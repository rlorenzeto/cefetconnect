describe("Feature: Feed de Publicações (FeedPage)", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);

    // 1. Injeta o usuário completo e consistente no localStorage
    cy.window().then((win) => {
      win.localStorage.setItem(
        "cefetconnect_user",
        JSON.stringify({ idUsuario: 1, matricula: "12345678901", token: "fake-jwt-token", nomeUsuario: "Johnatan Duarte" }),
      );
    });

    // 2. Mock do Perfil
    cy.intercept("GET", "**/usuario/*", {
      statusCode: 200,
      body: {
        dados: {
          idUsuario: 1,
          matricula: "12345678901",
          nomeUsuario: "Johnatan Duarte",
          fotoUrl: "",
        },
      },
    }).as("loadProfile");

    // 3. Mock das comunidades da barra lateral do Feed
    cy.intercept("GET", "**/comunidade/usuario/minhas", {
      statusCode: 200,
      body: { dados: [] } 
    }).as("loadMyCommunities");

    // ==========================================
    // CORREÇÃO: Mocks de Eventos para a barra lateral do Feed
    // Isso vai impedir que o Promise.all quebre com "Failed to fetch"!
    // ==========================================
    cy.intercept("GET", "**/evento", {
      statusCode: 200,
      body: { dados: [] }
    }).as("loadFeedEventsGeral");

    cy.intercept("GET", "**/evento/meus", {
      statusCode: 200,
      body: { dados: [] }
    }).as("loadFeedMyEvents");

    // 4. Mock do Feed de Posts Super Robusto
    cy.intercept("GET", "**/post", {
      statusCode: 200,
      body: {
        dados: [
          {
            idPost: 999,
            conteudo: "Post inicial para testes!",
            dataHoraPublicacao: new Date().toISOString(),
            comunidade: null, 
            usuario: {
              idUsuario: 1,
              matricula: "12345678901",
              nomeUsuario: "Johnatan Duarte",
              fotoUrl: ""
            },
            curtidas: [],
            comentarios: []
          },
        ],
      },
    }).as("loadPosts");

    // 5. Mock das Curtidas do Post
    cy.intercept("GET", "**/post/*/curtidas", {
      statusCode: 200,
      body: { dados: { total: 0, totalCurtidas: 0, usuarios: [] } },
    }).as("loadLikes");

    // Mock GLOBAL das curtidas de comentários
    cy.intercept("GET", "**/comentario/*/curtidas", {
      statusCode: 200,
      body: { dados: { total: 0, totalCurtidas: 0, usuarios: [] } },
    }).as("loadCommentLikes");

    cy.visit("http://localhost:5173/home");
    
    // Esperamos as requisições principais de dados carregarem com estabilidade
    cy.wait(["@loadProfile", "@loadMyCommunities", "@loadPosts"]);
    cy.wait(1000); 

    // Validação visual final: Garante que o post renderizou e sumiu com o erro da tela
    cy.contains("Post inicial para testes!").should("be.visible");
  });

  // ... Mantenha o restante do arquivo (cenários de 1 a 9) exatamente como estão abaixo ...
  // ==========================================
  // CRIAÇÃO DE POSTS
  // ==========================================

  it("Cenário 1: Sucesso - Criar um novo post de texto", () => {
    cy.intercept("POST", "**/post", {
      delay: 500,
      statusCode: 201,
      body: {
        dados: {
          idPost: 1000,
          conteudo: "Testando meu novo feed!",
          dataHoraPublicacao: new Date().toISOString(),
          usuario: { matricula: "12345678901", nomeUsuario: "Johnatan Duarte" },
        },
      },
    }).as("createPost");

    // ADICIONADO O :visible AQUI
    cy.get('textarea[placeholder*="No que você está pensando"]:visible').type(
      "Testando meu novo feed!",
      { delay: 100 },
    );
    cy.contains("button", "Postar").filter(":visible").click();

    cy.contains("button", "Publicando...")
      .filter(":visible")
      .should("be.visible");
    cy.wait("@createPost");

    cy.contains("Testando meu novo feed!").should("be.visible");
    cy.wait(2000);

    // ADICIONADO O :visible AQUI TAMBÉM
    cy.get('textarea[placeholder*="No que você está pensando"]:visible').should(
      "have.value",
      "",
    );
  });

  it("Cenário 2: Erro - Tentar criar post vazio", () => {
    cy.wait(2000);
    cy.contains("button", "Postar").filter(":visible").click();
    cy.contains("Escreva algo ou adicione pelo menos uma imagem.").should(
      "be.visible",
    );
    cy.wait(2000);
  });

  // ==========================================
  // CURTIDAS E INTERAÇÕES
  // ==========================================

  it("Cenário 3: Sucesso - Curtir um post", () => {
    cy.wait(2000);
    cy.intercept("POST", "**/post/*/curtir", {
      statusCode: 200,
      body: { message: "Post curtido com sucesso" },
    }).as("likePost");

    cy.contains("article", "Post inicial para testes!").dblclick();
    cy.wait(2000);
    cy.wait("@likePost");
  });

  // ==========================================
  // EDIÇÃO E EXCLUSÃO
  // ==========================================

  it("Cenário 4: Sucesso - Editar um post", () => {
    cy.wait(2000);
    cy.intercept("PATCH", "**/post/*", {
      delay: 500,
      statusCode: 200,
      body: { message: "Post atualizado" },
    }).as("updatePost");

    cy.intercept("GET", "**/post/999", {
      statusCode: 200,
      body: {
        dados: {
          idPost: 999,
          conteudo: "Post inicial editado com sucesso!",
          dataHoraPublicacao: new Date().toISOString(),
          usuario: { matricula: "12345678901", nomeUsuario: "Johnatan Duarte" },
        },
      },
    }).as("getPostById");

    cy.contains("article", "Post inicial para testes!")
      .find("button")
      .contains("⋯")
      .click();
      cy.wait(1000);

    cy.contains("button", "Editar").click();

    // ADICIONADO O :visible ANTES DO .last()
    // Assim, ele pega o último textarea que está VISÍVEL na tela (o do modal aberto)
    cy.get("textarea:visible")
      .last()
      .clear()
      .type("Post inicial editado com sucesso!", { delay: 100 });

    // Se no seu modal o botão tiver outro nome (como "Salvar" ou "Atualizar"), ajuste aqui
    cy.contains("button", "Salvar").filter(":visible").click();

    cy.wait("@updatePost");
    cy.wait("@getPostById");

    cy.contains("Post inicial editado com sucesso!").should("be.visible");
    cy.wait(2000);
  });

  it("Cenário 5: Sucesso - Excluir um post", () => {
    cy.wait(2000);
    cy.intercept("DELETE", "**/post/*", {
      delay: 500,
      statusCode: 200,
      body: { message: "Post excluído" },
    }).as("deletePost");

    cy.contains("article", "Post inicial para testes!")
      .find("button")
      .contains("⋯")
      .click();
      cy.wait(1000);

    cy.contains("button", "Excluir").click();

    // Foca no modal de confirmação
    cy.contains("Excluir publicação?").should("be.visible");
    cy.wait(2000);
    cy.get(".z-\\[1000\\]").contains("button", "Excluir").click();

    cy.wait("@deletePost");

    cy.contains("Post inicial para testes!").should("not.exist");
  });

  // ==========================================
  // SEÇÃO DE COMENTÁRIOS
  // ==========================================

  it('Cenário 6: Sucesso - Escrever e enviar um comentário', () => {
    cy.intercept('GET', '**/comentario/post/*', {
      statusCode: 200,
      body: { dados: [] }
    }).as('loadComments');

    cy.intercept('POST', '**/comentario/post/*', {
      delay: 500,
      statusCode: 201,
      body: {
        dados: {
          idComentario: 500,
          texto: "Testando o comentario", // CORREÇÃO: Mudado de 'conteudo' para 'texto'
          usuario: { matricula: "12345678901", nomeUsuario: "Johnatan Duarte" }
        }
      }
    }).as('createComment');

    cy.contains('button', 'Mostrar comentários').filter(':visible').click();
    cy.wait('@loadComments');

    // ADICIONADO O DELAY AQUI NO SEGUNDO PARÂMETRO
    cy.get('input[placeholder="Escreva um comentário..."]:visible').type('Testando o comentario', { delay: 100 });

    cy.contains('button', 'Comentar').filter(':visible').click();
    cy.wait('@createComment');
    
    // Aguardamos o GET invisível de curtidas que acontece quando o comentário aparece na tela
    cy.wait('@loadCommentLikes'); 

    cy.contains('Testando o comentario').should('be.visible');
    
    cy.get('input[placeholder="Escreva um comentário..."]:visible').should('have.value', '');
    cy.wait(1000);
  });

  it('Cenário 7: Sucesso - Curtir um comentário', () => {
    cy.intercept('GET', '**/comentario/post/*', {
      statusCode: 200,
      body: { 
        dados: [ 
          { 
            idComentario: 555, 
            texto: "Comentário para curtir", 
            usuario: { matricula: "12345678901", nomeUsuario: "Johnatan Duarte" }
          } 
        ] 
      }
    }).as('loadComments');

    cy.intercept('POST', '**/comentario/*/curtir', {
      statusCode: 200,
      body: { message: "Comentário curtido" }
    }).as('likeComment');

    cy.wait(1000);
    cy.contains('button', 'Mostrar comentários').filter(':visible').click();
    cy.wait(1000);
    cy.wait(['@loadComments', '@loadCommentLikes']);

    // Procuramos o artigo do comentário e clicamos no botão de Curtir
    cy.contains('article', 'Comentário para curtir')
      .find('button:visible')
      .contains('Curtir')
      .click();
      cy.wait(1000);

    cy.wait('@likeComment');
  });

  it('Cenário 8: Sucesso - Editar um comentário', () => {
    cy.intercept('GET', '**/comentario/post/*', {
      statusCode: 200,
      body: { 
        dados: [ 
          { 
            idComentario: 555, 
            texto: "Comentário para editar", 
            // REFORÇO VITAL: idUsuario adicionado para o React saber que você é o dono legítimo!
            usuario: { idUsuario: 1, matricula: "12345678901", nomeUsuario: "Johnatan Duarte" }
          } 
        ] 
      }
    }).as('loadComments');

    cy.intercept('PATCH', '**/comentario/*', { 
      statusCode: 200,
      body: { message: "Comentário atualizado" }
    }).as('updateComment');

    cy.wait(1000);
    cy.contains('button', 'Mostrar comentários').filter(':visible').click();
    cy.wait(1000);
    cy.wait(['@loadComments', '@loadCommentLikes']);

    // Mira cirúrgica usando a classe de fundo do comentário para achar o botão correto
    cy.contains('article.bg-\\[\\#f7f7f7\\]', 'Comentário para editar')
      .find('button')
      .contains('Editar')
      .click({ force: true });
    
    // Limpa o campo e digita a alteração
    cy.get('textarea:visible').last().clear().type('Comentário alterado!', { delay: 100 });
    
    cy.contains('button', 'Salvar').filter(':visible').click({ force: true }); 

    cy.wait('@updateComment');
    cy.contains('Comentário alterado!').should('be.visible');
    cy.wait(1000);
  });

  it('Cenário 9: Sucesso - Excluir um comentário', () => {
    cy.intercept('GET', '**/comentario/post/*', {
      statusCode: 200,
      body: { 
        dados: [ 
          { 
            idComentario: 555, 
            texto: "Comentário para excluir", 
            // REFORÇO VITAL: idUsuario adicionado aqui também!
            usuario: { idUsuario: 1, matricula: "12345678901", nomeUsuario: "Johnatan Duarte" }
          } 
        ] 
      }
    }).as('loadComments');

    cy.intercept('DELETE', '**/comentario/*', {
      statusCode: 200,
      body: { message: "Comentário excluído" }
    }).as('deleteComment');
    
    cy.wait(1000);
    cy.contains('button', 'Mostrar comentários').filter(':visible').click();
    cy.wait(1000);
    cy.wait(['@loadComments', '@loadCommentLikes']);

    cy.on('window:confirm', () => true);

    // Mira cirúrgica para clicar no Excluir do comentário correto
    cy.contains('article.bg-\\[\\#f7f7f7\\]', 'Comentário para excluir')
      .find('button')
      .contains('Excluir')
      .click({ force: true });

    cy.wait('@deleteComment');

    // O comentário deve sumir da tela com sucesso
    cy.contains('Comentário para excluir').should('not.exist');
  });
});
