describe('Feature: Cadastro de Usuário (RegisterForm)', () => {

  beforeEach(() => {
    cy.viewport(1280, 720);
    cy.visit('http://localhost:5173/register'); 
  });

  it('Cenário 1: Sucesso - Dados válidos e redirecionamento', () => {
    cy.intercept('POST', '**/usuario', { 
      delay: 1000,
      statusCode: 201,
      body: { 
        message: 'Usuário criado com sucesso',
        dados: { idUsuario: 1, matricula: '12345678901', email: 'joao@aluno.cefetmg.br' }
      }
    }).as('registerRequest');

    cy.get('input[name="name"]:visible').type('João da Silva', { delay: 50 });
    cy.get('input[name="email"]:visible').type('joao@aluno.cefetmg.br', { delay: 50 });
    cy.get('input[name="registration"]:visible').type('12345678901', { delay: 50 });
    
    // Senha forte exigida pela validação do seu componente (Letra Maiúscula + Número + Especial)
    cy.get('input[name="password"]:visible').type('Senha@Segura123', { delay: 50 }); 
    cy.wait(500);

    cy.get('button[type="submit"]:visible').click();

    // Garante que o botão entra em estado de processamento (isSubmitting)
    cy.get('button[type="submit"]:visible').should('be.disabled');
    
    cy.wait('@registerRequest');
    
    cy.url().should('include', '/confirm-email');
    cy.wait(1000);
  });

  it('Cenário 2: Erro - E-mail com formato inválido', () => {
    cy.get('form').invoke('attr', 'novalidate', 'novalidate');

    cy.get('input[name="name"]:visible').type('João da Silva', { delay: 50 });
    cy.get('input[name="email"]:visible').type('joao.sem.arroba.com', { delay: 50 });
    cy.get('input[name="registration"]:visible').type('12345678901', { delay: 50 });
    cy.get('input[name="password"]:visible').type('Senha@Segura123', { delay: 50 }); 

    cy.get('button[type="submit"]:visible').click();

    cy.contains('Digite um e-mail válido.').filter(':visible').should('be.visible');
    cy.wait(2000);
  });

  it('Cenário 3: Erro - Matrícula inválida', () => {
    cy.get('input[name="name"]:visible').type('João da Silva', { delay: 50 });
    cy.get('input[name="email"]:visible').type('joao@aluno.cefetmg.br', { delay: 50 });
    cy.get('input[name="registration"]:visible').type('12345', { delay: 50 }); 
    cy.get('input[name="password"]:visible').type('Senha@Segura123', { delay: 50 }); 

    cy.get('button[type="submit"]:visible').click();

    // Texto exato mapeado do seu componente
    cy.contains('A matrícula deve ter exatamente 7 ou 11 dígitos.').filter(':visible').should('be.visible');
    cy.wait(2000);
  });

  it('Cenário 4: Erro - Senha muito curta', () => {
    cy.get('input[name="name"]:visible').type('João da Silva', { delay: 50 });
    cy.get('input[name="email"]:visible').type('joao@aluno.cefetmg.br', { delay: 50 });
    cy.get('input[name="registration"]:visible').type('12345678901', { delay: 50 });
    cy.get('input[name="password"]:visible').type('1d7', { delay: 50 }); 

    cy.get('button[type="submit"]:visible').click();

    // Texto exato mapeado do seu componente (mínimo de 8 caracteres agora)
    cy.contains('A senha deve ter no mínimo 8 caracteres.').filter(':visible').should('be.visible');
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
    cy.get('input[name="password"]:visible').type('Senha@Segura123', { delay: 50 }); 

    cy.get('button[type="submit"]:visible').click();
    cy.wait('@registerRequestError');

    cy.contains('Este e-mail já está em uso.').filter(':visible').should('be.visible');
    cy.wait(2000);
  });

  it('Cenário 6: Navegação - Ir para Login', () => {
    // Alvo certeiro: Procurar pela tag button que contém textualmente "Entrar"
    cy.contains('button', 'Entrar').filter(':visible').click({ force: true });
    
    cy.url().should('include', '/login');
  });
});