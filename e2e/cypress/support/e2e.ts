/// <reference types="cypress" />

Cypress.Commands.add('register', (email: string, pseudo: string, password: string) => {
  cy.request('POST', 'http://localhost:3000/api/auth/register', {
    email,
    pseudo,
    password,
  });
}); 

Cypress.Commands.add('login', (email: string, password: string) => {
  cy.request('POST', 'http://localhost:3000/api/auth/login', {
    email,
    password,
  }).then((res) => {
    localStorage.setItem('token', res.body.token);
    localStorage.setItem('user', JSON.stringify(res.body.user));
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      register(email: string, pseudo: string, password: string): Chainable<void>;
      login(email: string, password: string): Chainable<void>;
    }
  }
}

export {};
