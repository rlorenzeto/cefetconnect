describe("Feature: Autenticação de Usuário (LoginForm)", () => {
  beforeEach(() => {
    // Força a resolução desktop para o Tailwind não esconder os inputs

    cy.visit("http://localhost:5173");
  });

  it("Cenário 1: Sucesso - Credenciais válidas", () => {
    cy.intercept("POST", "**/login", {
      delay: 1000,
      statusCode: 200,
      body: { token: "token-fake-123" },
    }).as("loginRequest");

    cy.get('input[name="login"]:visible').type("johnatan@aluno.cefetmg.br", {
      delay: 100,
    });
    cy.get('input[name="senha"]:visible').type("senhaForte123", { delay: 100 });

    // Clica no AuthButton (que tem type="submit")
    cy.get('button[type="submit"]:visible').click();

    cy.get('button[type="submit"]:visible').should("contain", "Entrando...");
    cy.wait("@loginRequest");

    // Mudança: Agora redireciona para /profile
    cy.url().should("include", "/profile");
    cy.wait(2000);
  });

  it("Cenário 2: Erro - E-mail com formato inválido", () => {
    // Desativa a validação nativa do navegador no formulário inteiro.
    // Assim, o envio passa direto para o handleSubmit do seu React!
    cy.get('form').invoke('attr', 'novalidate', 'novalidate');

    cy.get('input[name="login"]:visible').type("johnatan.sem.arroba.com", { delay: 100 });
    cy.get('input[name="senha"]:visible').type("qualquerSenha", { delay: 100 });

    cy.get('button[type="submit"]:visible').click();

    // Como o navegador não bloqueou, o React roda e exibe nossa mensagem
    cy.contains("Digite um e-mail válido.").filter(':visible').should("be.visible");
    cy.wait(2000);

    cy.url().should("not.include", "/profile");
  });

  it("Cenário 3: Erro - Campos obrigatórios vazios", () => {
    cy.get('input[name="login"]:visible').type("a{backspace}");
    cy.get('input[name="senha"]:visible').type("a{backspace}");

    cy.get('input[name="login"]:visible').invoke("removeAttr", "required");

    cy.get('button[type="submit"]:visible').click();

    cy.contains("O e-mail é obrigatório.")
      .filter(":visible")
      .should("be.visible");
    cy.contains("A senha é obrigatória.")
      .filter(":visible")
      .should("be.visible");
    cy.wait(2000);
  });

  it("Cenário 4: Erro - Credenciais inválidas (Erro na API)", () => {
    cy.intercept("POST", "**/login", {
      delay: 1000,
      statusCode: 401,
      body: { message: "Credenciais inválidas" },
    }).as("loginRequestError");

    cy.get('input[name="login"]:visible').type("johnatan@aluno.cefetmg.br", {
      delay: 100,
    });
    cy.get('input[name="senha"]:visible').type("senhaErrada", { delay: 100 });

    cy.get('button[type="submit"]:visible').click();
    cy.wait("@loginRequestError");

    cy.contains("Credenciais inválidas")
      .filter(":visible")
      .should("be.visible");
  });

  it("Cenário 5: Erro - Conta não verificada e redirecionamento (NOVO)", () => {
    // Simula a API retornando um erro que contém a palavra "verificado"
    cy.intercept("POST", "**/login", {
      delay: 1000,
      statusCode: 403, // ou 401 dependendo do seu backend
      body: { message: "Seu e-mail ainda não foi verificado." },
    }).as("loginUnverified");

    cy.get('input[name="login"]:visible').type("johnatan@aluno.cefetmg.br");
    cy.get('input[name="senha"]:visible').type("senhaCorreta123");

    cy.get('button[type="submit"]:visible').click();
    cy.wait("@loginUnverified");

    // Verifica se a nova caixa de ajuda apareceu
    cy.contains("Esse e-mail ainda não foi confirmado.")
      .filter(":visible")
      .should("be.visible");

    // Testa a validação da matrícula (menos de 11 dígitos)
    cy.get('input[placeholder="Digite sua matrícula"]:visible').type("12345");
    cy.contains("button", "Confirmar meu e-mail").filter(":visible").click();
    cy.contains("A matrícula deve ter exatamente 11 dígitos.")
      .filter(":visible")
      .should("be.visible");

    // Preenche a matrícula corretamente (o React substitui tudo se usarmos selectAll)
    cy.get('input[placeholder="Digite sua matrícula"]:visible').type(
      "{selectall}{backspace}12345678901",
    );
    cy.contains("button", "Confirmar meu e-mail").filter(":visible").click();

    // Valida se redirecionou para a página correta salvando os dados no state
    cy.url().should("include", "/confirm-email");
  });
});
