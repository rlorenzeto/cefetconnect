const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Força o Cypress a usar uma resolução de Desktop (ex: 1280x720)
    // Isso impede que o Tailwind esconda o formulário com a classe "hidden"
    viewportWidth: 1280, 
    viewportHeight: 720,  
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});