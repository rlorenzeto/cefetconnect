describe('Feature: Gestão de Eventos (EventsPage)', () => {

  // Variável base para simular o nosso evento durante todo o fluxo
  // Colocamos uma data futura para passar na validação do seu EventFormModal
  // Variável base para simular o nosso evento durante todo o fluxo
  const eventoTeste = {
    idEvento: 50,
    titulo: "Hackathon de Automação",
    descricaoEvento: "Evento incrível para testar os conhecimentos em Cypress e React.",
    localEvento: "Laboratório de Informática",
    dataEvento: "2026-12-31T14:00:00.000Z", // Data futura garantida
    status: true,
    isFinalizado: false,
    
    // REFORÇO: Adicionamos todas as variações possíveis de chaves que o seu 
    // frontend pode estar usando para validar quem é o dono do evento!
    idCriador: 1,
    usuario: { idUsuario: 1, matricula: "12345678901", nomeUsuario: "Johnatan Duarte" },
    criador: { idUsuario: 1, matricula: "12345678901", nomeUsuario: "Johnatan Duarte" },
    
    participantes: [] 
  };

  beforeEach(() => {
    cy.viewport(1920, 1080); // Resolução ideal para evitar sobreposição de menu

    // Injeta o usuário autenticado
    cy.window().then((win) => {
      win.localStorage.setItem(
        "cefetconnect_user", 
        JSON.stringify({ idUsuario: 1, matricula: "12345678901", token: "fake-jwt", nomeUsuario: "Johnatan Duarte" })
      );
    });
  });

  // ==========================================
  // CENÁRIO 1: CRIAR NOVO EVENTO
  // ==========================================
  it('Cenário 1: Sucesso - Criar um novo evento', () => {
    // 1. A página carrega inicialmente SEM eventos
    cy.intercept('GET', '**/evento', { statusCode: 200, body: { dados: [] } }).as('loadEvents');
    cy.intercept('GET', '**/evento/meus', { statusCode: 200, body: { dados: [] } }).as('loadMyEvents');
    cy.intercept('GET', '**/comunidade/usuario/minhas', { statusCode: 200, body: { dados: [] } }).as('loadMyCommunities');
    
    cy.visit('http://localhost:5173/eventos');
    cy.wait(['@loadEvents', '@loadMyEvents', '@loadMyCommunities']);
    cy.wait(1000);

    // Mock do POST de criação
    cy.intercept('POST', '**/evento', {
      delay: 500,
      statusCode: 201,
      body: { message: "Evento criado com sucesso" }
    }).as('createEvent');

    // Prepara o mock para retornar o evento NOVO após o salvamento
    cy.intercept('GET', '**/evento', { 
      statusCode: 200, 
      body: { dados: [eventoTeste] } 
    }).as('loadWithNewEvent');

    // Abre o modal
    cy.contains('button', 'Novo evento').filter(':visible').click({ force: true });

    // Preenche o formulário (respeitando os 'name' do seu código)
    cy.get('input[name="titulo"]:visible').type('Hackathon de Automação', { delay: 50 });
    cy.get('textarea[name="descricaoEvento"]:visible').type('Evento incrível para testar os conhecimentos em Cypress e React.', { delay: 50 });
    cy.get('input[name="dataEvento"]:visible').type('2026-12-31T14:00'); // O cypress preenche datetime-local perfeitamente assim
    cy.get('input[name="localEvento"]:visible').type('Laboratório de Informática', { delay: 50 });

    // Clica em Avançar (que é o botão de submit do seu modal)
    cy.contains('button', 'Avançar').filter(':visible').click();

    cy.wait('@createEvent');
    cy.wait('@loadWithNewEvent');
    cy.wait(1000);

    // O evento deve aparecer na tela e o modal deve ter fechado
    cy.contains('Hackathon de Automação').should('be.visible');
    cy.get('input[name="titulo"]').should('not.exist'); 
  });

  // ==========================================
  // CENÁRIO 2: PARTICIPAR DE EVENTO
  // ==========================================
  it('Cenário 2: Sucesso - Participar de um evento existente', () => {
    // Carrega a página com o evento, mas indicando que NÃO participamos (evento/meus vazio)
    cy.intercept('GET', '**/evento', { statusCode: 200, body: { dados: [eventoTeste] } }).as('loadEvents');
    cy.intercept('GET', '**/evento/meus', { statusCode: 200, body: { dados: [] } }).as('loadMyEventsNotParticipating');
    cy.intercept('GET', '**/comunidade/usuario/minhas', { statusCode: 200, body: { dados: [] } }).as('loadMyCommunities');

    cy.visit('http://localhost:5173/eventos');
    cy.wait(['@loadEvents', '@loadMyEventsNotParticipating', '@loadMyCommunities']);
    cy.wait(1000);

    // Mock do clique em participar
    cy.intercept('POST', '**/evento/*/participar', { statusCode: 200, body: { message: "Participação confirmada" } }).as('joinEvent');
    
    // O seu código busca os detalhes do evento atualizados após participar
    cy.intercept('GET', '**/evento/50', { 
      statusCode: 200, 
      body: { dados: { ...eventoTeste, participantes: [{ idUsuario: 1 }] } } 
    }).as('getEventDetails');

    // Prepara o mock para dizer que agora fazemos parte (evento/meus tem o ID do evento)
    cy.intercept('GET', '**/evento/meus', { statusCode: 200, body: { dados: [{ idEvento: 50 }] } }).as('loadMyEventsParticipating');

    cy.contains('article', 'Hackathon de Automação').contains('button', 'Participar').filter(':visible').click({ force: true });

    cy.wait('@joinEvent');
    cy.wait('@getEventDetails');
    cy.wait('@loadMyEventsParticipating');
    cy.wait(1000);

    // O botão deve ter mudado para "Sair do evento"
    cy.contains('article', 'Hackathon de Automação').contains('button', 'Sair do evento').should('be.visible');
  });

  // ==========================================
  // CENÁRIO 3: SAIR DE UM EVENTO
  // ==========================================
  it('Cenário 3: Sucesso - Cancelar participação em um evento', () => {
    // Carrega a página indicando que JÁ participamos
    cy.intercept('GET', '**/evento', { statusCode: 200, body: { dados: [eventoTeste] } }).as('loadEvents');
    cy.intercept('GET', '**/evento/meus', { statusCode: 200, body: { dados: [{ idEvento: 50 }] } }).as('loadMyEventsParticipating');
    cy.intercept('GET', '**/comunidade/usuario/minhas', { statusCode: 200, body: { dados: [] } }).as('loadMyCommunities');

    cy.visit('http://localhost:5173/eventos');
    cy.wait(['@loadEvents', '@loadMyEventsParticipating', '@loadMyCommunities']);
    cy.wait(1000);

    cy.intercept('DELETE', '**/evento/*/sair', { statusCode: 200, body: { message: "Participação cancelada" } }).as('leaveEvent');
    
    cy.intercept('GET', '**/evento/50', { statusCode: 200, body: { dados: eventoTeste } }).as('getEventDetailsEmpty');
    
    // Retorna para o estado vazio
    cy.intercept('GET', '**/evento/meus', { statusCode: 200, body: { dados: [] } }).as('loadMyEventsNotParticipating');

    cy.contains('article', 'Hackathon de Automação').contains('button', 'Sair do evento').filter(':visible').click({ force: true });

    cy.wait('@leaveEvent');
    cy.wait('@getEventDetailsEmpty');
    cy.wait('@loadMyEventsNotParticipating');
    cy.wait(1000);

    // O botão volta a ser "Participar"
    cy.contains('article', 'Hackathon de Automação').contains('button', 'Participar').should('be.visible');
  });

  // ==========================================
  // CENÁRIO 4: EDITAR EVENTO PRÓPRIO
  // ==========================================
  it('Cenário 4: Sucesso - Editar um evento', () => {
    cy.intercept('GET', '**/evento', { statusCode: 200, body: { dados: [eventoTeste] } }).as('loadEvents');
    cy.intercept('GET', '**/evento/meus', { statusCode: 200, body: { dados: [] } }).as('loadMyEvents');
    cy.intercept('GET', '**/comunidade/usuario/minhas', { statusCode: 200, body: { dados: [] } }).as('loadMyCommunities');

    cy.visit('http://localhost:5173/eventos');
    cy.wait(['@loadEvents', '@loadMyEvents', '@loadMyCommunities']);
    cy.wait(1000);

    cy.intercept('PATCH', '**/evento/50', { statusCode: 200, body: { message: "Evento atualizado" } }).as('updateEvent');
    
    // Lista de eventos atualizada com o novo título
    cy.intercept('GET', '**/evento', { 
      statusCode: 200, 
      body: { dados: [{ ...eventoTeste, titulo: "Hackathon de React Avançado" }] } 
    }).as('loadEditedEvents');

    // Clica em Editar no card
    cy.contains('article', 'Hackathon de Automação').contains('button', 'Editar').filter(':visible').click({ force: true });

    // Altera o título no modal
    cy.get('input[name="titulo"]:visible').clear().type('Hackathon de React Avançado', { delay: 50 });
    cy.contains('button', 'Avançar').filter(':visible').click();

    cy.wait('@updateEvent');
    cy.wait('@loadEditedEvents');
    cy.wait(1000);

    cy.contains('Hackathon de React Avançado').should('be.visible');
  });

  // ==========================================
  // CENÁRIO 5: EXCLUIR EVENTO
  // ==========================================
  it('Cenário 5: Sucesso - Excluir um evento próprio', () => {
    // Usando o título editado para manter a lógica do teste
    const eventoExcluir = { ...eventoTeste, titulo: "Hackathon de React Avançado" };

    cy.intercept('GET', '**/evento', { statusCode: 200, body: { dados: [eventoExcluir] } }).as('loadEvents');
    cy.intercept('GET', '**/evento/meus', { statusCode: 200, body: { dados: [] } }).as('loadMyEvents');
    cy.intercept('GET', '**/comunidade/usuario/minhas', { statusCode: 200, body: { dados: [] } }).as('loadMyCommunities');

    cy.visit('http://localhost:5173/eventos');
    cy.wait(['@loadEvents', '@loadMyEvents', '@loadMyCommunities']);
    cy.wait(1000);

    cy.intercept('DELETE', '**/evento/50', { statusCode: 200, body: { message: "Excluído com sucesso" } }).as('deleteEvent');
    
    // Após a exclusão, a lista de eventos ficará vazia
    cy.intercept('GET', '**/evento', { statusCode: 200, body: { dados: [] } }).as('loadEmptyEvents');

    // Confirma automaticamente o alerta do navegador
    cy.on('window:confirm', () => true);

    // Clica em Excluir
    cy.contains('article', 'Hackathon de React Avançado').contains('button', 'Excluir').filter(':visible').click({ force: true });

    cy.wait('@deleteEvent');
    cy.wait('@loadEmptyEvents');
    cy.wait(1000);

    // O evento não existe mais na tela
    cy.contains('Hackathon de React Avançado').should('not.exist');
  });

});