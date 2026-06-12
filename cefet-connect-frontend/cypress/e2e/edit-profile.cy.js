describe("Feature: Edição de Perfil (EditProfilePage)", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);

    // 1. CORREÇÃO: Injetamos o idUsuario obrigatório para passar pelo Route Guard sem ser ejetado para o login
    cy.window().then((win) => {
      win.localStorage.setItem(
        "cefetconnect_user",
        JSON.stringify({ idUsuario: 1, matricula: "12345678901", token: "fake-jwt-token", nomeUsuario: "Johnatan Duarte" }),
      );
    });

    // 2. Interceptamos o carregamento inicial do perfil (GET) - Adicionado idUsuario no mock
    cy.intercept("GET", "**/usuario/*", {
      statusCode: 200,
      body: {
        dados: {
          idUsuario: 1,
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
          idUsuario: 1,
          matricula: "12345678901",
          email: "johnatan@aluno.cefetmg.br",
          nomeUsuario: "Johnatan Editado", 
          biografia: "Nova descrição acadêmica"
        } 
      }
    }).as('updateProfile');

    // O campo é editável! Usamos o force: true para impedir que o re-render do StrictMode quebre o teste
    cy.get('input[name="nomeUsuario"]:visible').clear().type('Johnatan Editado', { force: true });
    cy.get('[name="biografia"]:visible').clear().type('Nova descrição acadêmica', { force: true });

    cy.contains('button', 'Salvar perfil').filter(':visible').click();
    cy.wait('@updateProfile');

    cy.contains(/Perfil atualizado|sucesso/i).filter(':visible').should('be.visible');
    cy.url().should('include', '/profile/edit');
    cy.wait(2000);
  });

  it("Cenário 2: Erro - Nome em branco", () => {
    cy.get('input[name="nomeUsuario"]:visible').clear();
    cy.wait(2000);

    cy.contains("button", "Salvar perfil").filter(":visible").click();

    cy.contains("O nome é obrigatório.").filter(":visible").should("be.visible");
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

    cy.get('input[name="novoEmail"]:visible').clear().type("novoemail@aluno.cefetmg.br");
    
    // Ajustado para senha forte padrão do sistema
    cy.get('input[name="senha"]:visible').type("Senha@Atual123", { delay: 50 });

    cy.contains("button", "Alterar e-mail").filter(":visible").click();
    cy.wait("@updateEmail");

    cy.contains(/E-mail alterado com sucesso|confirmado/i).filter(":visible").should("be.visible");
    cy.wait(2000);

    cy.get('input[name="senha"]:visible').should("have.value", "");
    cy.wait(2000);
  });

  it("Cenário 4: Erro - Troca de e-mail sem senha atual", () => {
    cy.get('input[name="novoEmail"]:visible').clear().type("novoemail@aluno.cefetmg.br", { delay: 50 });
    cy.get('input[name="senha"]:visible').clear(); 

    cy.contains("button", "Alterar e-mail").filter(":visible").click();

    // AJUSTE: Regex flexível que pega variações como "A senha é obrigatória" ou "Digite sua senha"
    cy.contains(/senha.*obrigatória|digite.*senha|senha.*atual/i)
      .filter(":visible")
      .should("be.visible");
    cy.wait(2000);
  });
  // ==========================================
  // BLOCO 3: SENHA (Vacinado com Senhas Fortes)
  // ==========================================

  it("Cenário 5: Sucesso - Alterar senha", () => {
    cy.intercept("PATCH", "**/usuario/*/alterar-senha", {
      delay: 500,
      statusCode: 200,
      body: { message: "Senha alterada" },
    }).as("updatePassword");

    // Vacina: Usando o formato de senha forte exigido pelo Cefet Connect
    cy.get('input[name="senhaAtual"]:visible').type("Senha@Atual123", { delay: 50 });
    cy.get('input[name="novaSenha"]:visible').type("Nova@Senha123", { delay: 50 });
    cy.get('input[name="confirmarNovaSenha"]:visible').type("Nova@Senha123", { delay: 50 });

    cy.contains("button", "Alterar senha").filter(":visible").click();
    cy.wait("@updatePassword");

    cy.contains(/sucesso|alterada/i).should("be.visible");
    cy.wait(2000);
  });

  it("Cenário 6: Erro - Senhas não coincidem", () => {
    cy.get('input[name="senhaAtual"]:visible').type("Senha@Atual123", { delay: 50 });
    cy.get('input[name="novaSenha"]:visible').type("Nova@Senha123", { delay: 50 });
    cy.get('input[name="confirmarNovaSenha"]:visible').type("Senha@Diferente123", { delay: 50 });

    cy.contains("button", "Alterar senha").filter(":visible").click();

    cy.contains("As senhas não coincidem.").filter(":visible").should("be.visible");
    cy.wait(2000);
  });

  it("Cenário 7: Erro - Senha muito curta", () => {
    cy.get('input[name="senhaAtual"]:visible').type("Senha@Atual123", { delay: 50 });
    cy.get('input[name="novaSenha"]:visible').type("1d7", { delay: 50 }); 
    cy.get('input[name="confirmarNovaSenha"]:visible').type("1d7", { delay: 50 });

    cy.contains("button", "Alterar senha").filter(":visible").click();

    cy.contains(/mínimo 8 caracteres|curta|tamanho/i).filter(":visible").should("be.visible");
    cy.wait(2000);
  });

  // ==========================================
  // BLOCO 4: EXCLUSÃO DE CONTA
  // ==========================================

  it("Cenário 8: Sucesso - Excluir conta e redirecionar", () => {
    // CORREÇÃO CIRÚRGICA: Usando Regex para interceptar o DELETE de /usuario/ID sem nenhuma chance de erro
    cy.intercept("DELETE", /\/usuario\/\d+/, {
      delay: 500,
      statusCode: 200,
      body: { message: "Conta excluída" },
    }).as("deleteAccount");

    cy.contains("button", "Excluir minha conta").filter(":visible").click();

    // Garante que o modal abriu na tela
    cy.contains("Tem certeza que deseja excluir sua conta?").should("be.visible");
    cy.wait(1000);

    // Clica em excluir no modal de confirmação
    cy.contains("Tem certeza que deseja excluir sua conta?")
      .closest('div')
      .parent()
      .contains("button", "Excluir")
      .click({ force: true });

    cy.wait("@deleteAccount");
    cy.url().should("include", "/login");
  });
});