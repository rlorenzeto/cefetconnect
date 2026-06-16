describe('Produção - Jornada Principal', () => {
  
  beforeEach(() => {
    cy.viewport(1920, 1080); 
    cy.visit('https://cefetconnect.linceonline.com.br/login');

    const email = Cypress.env('PROD_EMAIL');
    const senha = Cypress.env('PROD_PASSWORD');

    cy.get('input[name="login"]:visible').type(email);
    cy.get('input[name="senha"]:visible').type(senha);
    cy.get('button[type="submit"]:visible').click();

    cy.url().should('include', '/home');
    cy.wait(3000); 
  });

  // =========================================================
  // JORNADA 1: PESQUISAR POSTS NO FEED
  // =========================================================
  it('Pesquisar post no feed', () => {
    // 1ª Busca: "Opaaaaaa"
    cy.get('input:visible').first().should('be.visible').clear().type('Opaaaaaa', { delay: 100 }); 
    cy.wait(2000);
    cy.contains('Opaaaaaa', { matchCase: false }).should('be.visible');

    // 2ª Busca: "connect" 
    cy.get('input:visible').first().clear().type('connect', { delay: 100 }); 
    cy.wait(2000);
    cy.get('article').should('not.exist'); 

    // 3ª Busca: "victor"
    cy.get('input:visible').first().clear().type('victor', { delay: 100 }); 
    cy.wait(2000);
    cy.contains('victor', { matchCase: false }).should('be.visible');
  });

  // =========================================================
  // JORNADA 2: PESQUISAR COMUNIDADE
  // =========================================================
  it('Deve navegar até comunidades e realizar buscas', () => {
    cy.get('a[href="/comunidades"]').filter(':visible').first().click({ force: true });
    cy.url().should('include', '/comunidades');
    cy.wait(2000);

    // 1ª Busca: "Gerais"
    cy.get('input:visible').first().should('be.visible').clear().type('Gerais', { delay: 100 });
    cy.wait(1000);
    cy.contains('Gerais', { matchCase: false }).should('be.visible');

    // 2ª Busca: "connect"
    cy.get('input:visible').first().clear().type('connect', { delay: 100 });
    cy.wait(1000);
  });

  // =========================================================
  // JORNADA 3: PESQUISAR EVENTO
  // =========================================================
  it('Deve navegar até eventos e realizar buscas', () => {
    cy.get('a[href="/eventos"]').filter(':visible').first().click({ force: true });
    cy.url().should('include', '/eventos');
    cy.wait(2000);

    // 1ª Busca: "Sprint "
    cy.get('input:visible').first().should('be.visible').clear().type('Sprint ', { delay: 100 });
    cy.wait(1000);

    // 2ª Busca: "connect"
    cy.get('input:visible').first().clear().type('connect', { delay: 100 });
    cy.wait(1000);
  });

  // =========================================================
  // JORNADA 4: CURTIR E DESCURTIR COM ROLAGEM SUAVE
  // =========================================================
  it('Atualizar Ranking (Curtir/Descurtir)', () => {
    
    // 1. Rolagem Suave: Pega o post e rola a tela até ele ficar no MEIO da página
    cy.get('article').first().then(($el) => {
      $el[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    });

    // Pausa rápida para a animação da rolagem terminar e ficar visualmente agradável
    cy.wait(1000);

    // 2. Clica uma única vez no botão Curtir
    cy.get('article').first().within(() => {
      cy.contains('button', 'Curtir').should('be.visible').click({ force: true });
    });

    cy.wait(4000);

    // 4. Clica novamente no mesmo botão Curtir para realizar a ação de descurtir
    cy.get('article').first().within(() => {
      cy.contains('button', 'Curtir').should('be.visible').click({ force: true });
    });

    cy.wait(2000);
  });

});