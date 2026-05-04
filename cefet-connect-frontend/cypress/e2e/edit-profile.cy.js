describe("Feature: Edição de Perfil (EditProfilePage)", () => {
  beforeEach(() => {
    // 2. Injetamos um usuário no LocalStorage para o getCurrentUser() funcionar
    cy.window().then((win) => {
      win.localStorage.setItem(
        "cefetconnect_user",
        JSON.stringify({ matricula: "12345678901", token: "fake-jwt-token" }),
      );
    });

    // 3. Interceptamos o carregamento inicial do perfil (GET)
    cy.intercept("GET", "**/usuario/*", {
      statusCode: 200,
      body: {
        dados: {
          matricula: "12345678901",
          nomeUsuario: "Johnatan Duarte",
          email: "johnatan@gmail.com",
          biografia: "Oi",
        },
      },
    }).as("loadProfile");

    cy.visit("http://localhost:5173/profile/edit");
    cy.wait("@loadProfile"); // Espera a página carregar os dados antes de testar
  });

  // ==========================================
  // BLOCO 1: DADOS GERAIS DO PERFIL
  // ==========================================

    it('Cenário 1: Sucesso - Atualizar nome e biografia', () => {
    cy.intercept('PATCH', '**/usuario/*', { 
      delay: 500,
      statusCode: 200,
      body: { 
        message: "Sucesso", 
        dados: { 
          matricula: "12345678901", // Precisamos devolver a matrícula!
          email: "johnatan@aluno.cefetmg.br",
          nomeUsuario: "Johnatan Editado", 
          biografia: "Nova descrição acadêmica"
        } 
      }
    }).as('updateProfile');

    cy.get('input[name="nomeUsuario"]:visible').clear().type('Johnatan Editado');
    cy.get('[name="biografia"]:visible').clear().type('Nova descrição acadêmica');

    cy.contains('button', 'Salvar perfil').filter(':visible').click();
    cy.wait('@updateProfile');

    cy.contains('Perfil atualizado com sucesso.').filter(':visible').should('be.visible');
    
    // Podemos até garantir que o redirecionamento NÃO aconteceu:
    cy.url().should('include', '/profile/edit');
    cy.wait(2000);
  });

  it("Cenário 2: Erro - Nome em branco", () => {
    cy.get('input[name="nomeUsuario"]:visible').clear();
    cy.wait(2000);

    // Clica fora para tirar o foco ou clica direto em salvar
    cy.contains("button", "Salvar perfil").filter(":visible").click();

    cy.contains("O nome é obrigatório.")
      .filter(":visible")
      .should("be.visible");
    cy.wait(2000);
  });

  // ==========================================
  // BLOCO 2: E-MAIL
  // ==========================================

  it("Cenário 3: Sucesso - Solicitar troca de e-mail", () => {
    cy.intercept("PATCH", "**/usuario/*/alterar-email", {
      delay: 500,
      statusCode: 200,
      body: { message: "E-mail alterado" },
    }).as("updateEmail");

    cy.get('input[name="novoEmail"]:visible')
      .clear()
      .type("novoemail@aluno.cefetmg.br");
    cy.get('input[name="senha"]:visible').type("minhaSenhaAtual123", { delay: 50 });

    cy.contains("button", "Alterar e-mail").filter(":visible").click();
    cy.wait("@updateEmail");

    cy.contains(
      "E-mail alterado com sucesso. Verifique seu novo e-mail para ativar a conta.",
    )
      .filter(":visible")
      .should("be.visible");
    cy.wait(2000);

    // Verifica se o campo de senha foi limpo após o sucesso
    cy.get('input[name="senha"]:visible').should("have.value", "");
    cy.wait(2000);
  });

  it("Cenário 4: Erro - Troca de e-mail sem senha atual", () => {
    cy.get('input[name="novoEmail"]:visible')
      .clear()
      .type("novoemail@aluno.cefetmg.br", { delay: 50 });
    cy.get('input[name="senha"]:visible').clear(); // Garante que está vazio

    cy.contains("button", "Alterar e-mail").filter(":visible").click();

    cy.contains("Digite sua senha atual para alterar o e-mail.")
      .filter(":visible")
      .should("be.visible");
    cy.wait(2000);
  });

  // ==========================================
  // BLOCO 3: SENHA
  // ==========================================

  it("Cenário 5: Sucesso - Alterar senha", () => {
    cy.intercept("PATCH", "**/usuario/*/alterar-senha", {
      delay: 500,
      statusCode: 200,
      body: { message: "Senha alterada" },
    }).as("updatePassword");

    cy.get('input[name="senhaAtual"]:visible').type("senhaAtual123", { delay: 50 });
    cy.get('input[name="novaSenha"]:visible').type("novaSenhaForte", { delay: 50 });
    cy.get('input[name="confirmarNovaSenha"]:visible').type("novaSenhaForte", { delay: 50 });

    cy.contains("button", "Alterar senha").filter(":visible").click();
    cy.wait("@updatePassword");

    // Como abre um Modal de Sucesso (PasswordChangedCard), verificamos se ele existe
    cy.contains("sucesso", { matchCase: false }).should("be.visible");
    cy.wait(2000);
  });

  it("Cenário 6: Erro - Senhas não coincidem", () => {
    cy.get('input[name="senhaAtual"]:visible').type("senhaAtual123", { delay: 50 });
    cy.get('input[name="novaSenha"]:visible').type("novaSenha123", { delay: 50 });
    cy.get('input[name="confirmarNovaSenha"]:visible').type("senhaDiferente123", { delay: 50 });

    cy.contains("button", "Alterar senha").filter(":visible").click();

    cy.contains("As senhas não coincidem.")
      .filter(":visible")
      .should("be.visible");
    cy.wait(2000);
  });

  it("Cenário 7: Erro - Senha muito curta", () => {
    cy.get('input[name="senhaAtual"]:visible').type("senhaAtual123", { delay: 50 });
    cy.get('input[name="novaSenha"]:visible').type("12345", { delay: 50 }); // 5 chars
    cy.get('input[name="confirmarNovaSenha"]:visible').type("12345", { delay: 50 });

    cy.contains("button", "Alterar senha").filter(":visible").click();

    cy.contains("A nova senha deve ter no mínimo 8 caracteres.")
      .filter(":visible")
      .should("be.visible");
    cy.wait(2000);
  });

  // ==========================================
  // BLOCO 4: EXCLUSÃO DE CONTA
  // ==========================================

  it("Cenário 8: Sucesso - Excluir conta e redirecionar", () => {
    cy.intercept("DELETE", "**/usuario/*", {
      delay: 500,
      statusCode: 200,
      body: { message: "Conta excluída" },
    }).as("deleteAccount");

    // 1. Clica no botão vermelho da tela principal
    cy.contains("button", "Excluir minha conta").filter(":visible").click();

    // 2. Garante que o modal de confirmação apareceu na tela
    // O texto "Tem certeza que deseja..." garante que estamos vendo o modal
    cy.contains("Tem certeza que deseja excluir sua conta?").should(
      "be.visible",
    );
    cy.wait(2000);

    // 3. Busca o botão "Excluir" APENAS dentro do container do modal (.fixed.z-50)
    // Isso impede o Cypress de tentar clicar no botão escondido do mobile
    cy.get(".fixed.z-50").contains("button", "Excluir").click();

    // 4. Aguarda a requisição
    cy.wait("@deleteAccount");

    // 5. Verifica se foi jogado para a tela de login
    cy.url().should("include", "/login");
  });
});
