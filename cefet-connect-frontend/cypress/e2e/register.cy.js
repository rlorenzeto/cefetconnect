describe('Feature: Cadastro de Usuário (RegisterForm)', () => {

  beforeEach(() => {
    // Mantemos a resolução desktop
    cy.viewport(1280, 720);
    cy.visit('http://localhost:5173/register'); 
  });

  it('Cenário 1: Sucesso - Dados válidos e redirecionamento', () => {
    cy.intercept('POST', '**/usuario', { 
      delay: 1000,
      statusCode: 201,
      body: { 
        message: 'Usuário criado com sucesso',
        dados: { matricula: '12345678901', email: 'joao@aluno.cefetmg.br' }
      }
    }).as('registerRequest');

    cy.get('input[name="name"]:visible').type('João da Silva', { delay: 50 });
    cy.get('input[name="email"]:visible').type('joao@aluno.cefetmg.br', { delay: 50 });
    cy.get('input[name="registration"]:visible').type('12345678901', { delay: 50 });
    cy.get('input[name="password"]:visible').type('senhaSegura123', { delay: 50 }); 
    cy.wait(500);

    cy.get('button[type="submit"]:visible').click();

    // O texto do botão foi alterado no novo componente
    cy.get('button[type="submit"]:visible').should('contain', 'Cadastrando...');
    
    cy.wait('@registerRequest');
    
    // O novo fluxo redireciona para a tela de confirmação de e-mail
    cy.url().should('include', '/confirm-email');
    cy.wait(1000);
  });

  it('Cenário 2: Erro - E-mail com formato inválido', () => {
    // Desativa a validação nativa do HTML5 para testar o regex do React
    cy.get('form').invoke('attr', 'novalidate', 'novalidate');

    cy.get('input[name="name"]:visible').type('João da Silva', { delay: 50 });
    // Usamos um e-mail sem o @ para forçar o erro da regex genérica
    cy.get('input[name="email"]:visible').type('joao.sem.arroba.com', { delay: 50 });
    cy.get('input[name="registration"]:visible').type('12345678901', { delay: 50 });
    cy.get('input[name="password"]:visible').type('senhaSegura123', { delay: 50 }); 

    cy.get('button[type="submit"]:visible').click();

    // A mensagem de erro esperada também mudou
    cy.contains('Digite um e-mail válido.').filter(':visible').should('be.visible');
    cy.wait(2000);
  });

  it('Cenário 3: Erro - Matrícula inválida', () => {
    cy.get('input[name="name"]:visible').type('João da Silva', { delay: 50 });
    cy.get('input[name="email"]:visible').type('joao@aluno.cefetmg.br', { delay: 50 });
    cy.get('input[name="registration"]:visible').type('12345', { delay: 50 }); 
    cy.get('input[name="password"]:visible').type('senhaSegura123', { delay: 50 }); 

    cy.get('button[type="submit"]:visible').click();

    cy.contains('A matrícula deve ter exatamente 11 dígitos.').filter(':visible').should('be.visible');
    cy.wait(2000);
  });

  it('Cenário 4: Erro - Senha muito curta', () => {
    cy.get('input[name="name"]:visible').type('João da Silva', { delay: 50 });
    cy.get('input[name="email"]:visible').type('joao@aluno.cefetmg.br', { delay: 50 });
    cy.get('input[name="registration"]:visible').type('12345678901', { delay: 50 });
    cy.get('input[name="password"]:visible').type('1d7c5', { delay: 50 }); 

    cy.get('button[type="submit"]:visible').click();

    cy.contains('A senha deve ter no mínimo 6 caracteres.').filter(':visible').should('be.visible');
    cy.wait(2000);
  });

  it('Cenário 5: Erro - Retorno da API (ex: e-mail já existe)', () => {
    cy.intercept('POST', '**/usuario', {
      delay: 1000,
      statusCode: 400,
      body: { message: 'Este e-mail já está em uso.' }
    }).as('registerRequestError');

    cy.get('input[name="name"]:visible').type('João da Silva', { delay: 50 });
    cy.get('input[name="email"]:visible').type('joao@aluno.cefetmg.br', { delay: 50 });
    cy.get('input[name="registration"]:visible').type('12345678901', { delay: 50 });
    cy.get('input[name="password"]:visible').type('senhaSegura123', { delay: 50 }); 

    cy.get('button[type="submit"]:visible').click();
    cy.wait('@registerRequestError');

    cy.contains('Este e-mail já está em uso.').filter(':visible').should('be.visible');
    cy.wait(2000);
  });

  it('Cenário 6: Navegação - Ir para Login', () => {
    // O texto do botão no novo AuthButton agora é "Já tenho uma conta"
    cy.contains('button', 'Já tenho uma conta').filter(':visible').click();
    
    cy.url().should('include', '/login');
  });
});