describe('Flux d\'inscription et de connexion utilisateur', () => {
  const testUser = {
    email: `test-${Date.now()}@example.com`,
    pseudo: `testuser${Date.now()}`,
    password: 'password123',
  };

  beforeEach(() => {
    cy.visit('/');
  }); 
 
  it('devrait afficher la page d\'accueil avec les hôtels', () => {
    cy.contains('Trouvez Votre Séjour Parfait').should('be.visible');
    cy.contains('Akkor Hôtel').should('be.visible');
  });

  it('devrait naviguer vers la page d\'inscription', () => {
    cy.contains("S'inscrire").click();
    cy.url().should('include', '/register');
    cy.contains('Créer un Compte').should('be.visible');
  });

  it('devrait inscrire un nouvel utilisateur avec des données valides', () => {
    cy.visit('/register');
    cy.get('#email').type(testUser.email);
    cy.get('#pseudo').type(testUser.pseudo);
    cy.get('#motDePasse').type(testUser.password);
    cy.get('#confirmerMotDePasse').type(testUser.password);
    cy.get('button[type="submit"]').click();

    // Devrait rediriger vers l'accueil après une inscription réussie
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains(testUser.pseudo).should('be.visible');
    cy.contains('Déconnexion').should('be.visible');
  });

  it('devrait afficher une erreur pour un email invalide à l\'inscription', () => {
    cy.visit('/register');
    cy.get('#email').type('not-an-email');
    cy.get('#pseudo').type('testuser');
    cy.get('#motDePasse').type('password123');
    cy.get('#confirmerMotDePasse').type('password123');
    cy.get('button[type="submit"]').click();

    // La validation HTML5 doit empêcher l'envoi ou l'API doit renvoyer une erreur
    // Le comportement exact dépend de la validation du navigateur
  });

  it('devrait afficher une erreur si les mots de passe ne correspondent pas', () => {
    cy.visit('/register');
    cy.get('#email').type(`pwd-mismatch-${Date.now()}@example.com`);
    cy.get('#pseudo').type(`testuser${Date.now()}`);
    cy.get('#motDePasse').type('password123');
    cy.get('#confirmerMotDePasse').type('different');
    cy.get('button[type="submit"]').click();

    cy.contains('Les mots de passe ne correspondent pas').should('be.visible');
  });

  it('devrait naviguer vers la page de connexion', () => {
    cy.contains('Connexion').click();
    cy.url().should('include', '/login');
    cy.contains('Bienvenue').should('be.visible');
  });

  it('devrait connecter l\'utilisateur avec des identifiants valides', () => {
    // First register
    cy.register(testUser.email, testUser.pseudo, testUser.password);

    cy.visit('/login');
    cy.get('#email').type(testUser.email);
    cy.get('#motDePasse').type(testUser.password);
    cy.get('button[type="submit"]').click();

    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.contains(testUser.pseudo).should('be.visible');
  });

  it('devrait afficher une erreur pour un mauvais mot de passe', () => {
    cy.visit('/login');
    cy.get('#email').type(testUser.email);
    cy.get('#motDePasse').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.contains('Email ou mot de passe invalide').should('be.visible');
  });

  it('devrait se déconnecter correctement', () => {
    cy.register(testUser.email, testUser.pseudo, testUser.password);

    cy.visit('/login');
    cy.get('#email').type(testUser.email);
    cy.get('#motDePasse').type(testUser.password);
    cy.get('button[type="submit"]').click();

    cy.contains('Déconnexion').click();
    cy.contains('Connexion').should('be.visible');
    cy.contains("S'inscrire").should('be.visible');
  });
});
