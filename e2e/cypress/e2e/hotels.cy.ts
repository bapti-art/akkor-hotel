describe('Navigation dans les hôtels', () => {
  it('devrait afficher les hôtels sur la page d\'accueil', () => {
    cy.visit('/');
    cy.contains('Trouvez Votre Séjour Parfait').should('be.visible');
  });

  it('devrait proposer des filtres de recherche', () => {
    cy.visit('/');
    cy.get('input[placeholder="Nom d\'hôtel..."]').should('be.visible');
    cy.get('input[placeholder="Ville, pays..."]').should('be.visible');
  }); 

  it('devrait naviguer vers la page de détail d\'un hôtel', () => {
    cy.visit('/');
    cy.get('.hotel-card').first().click();
    cy.url().should('include', '/hotels/');
  });

  it('devrait afficher une invitation à se connecter pour une réservation non authentifiée', () => {
    cy.visit('/');
    cy.get('.hotel-card').first().click();
    cy.contains('Connectez-vous').should('be.visible');
  }); 

  it('devrait filtrer les hôtels par nom', () => {
    cy.visit('/');
    cy.get('input[placeholder="Nom de l\'hôtel..."]').type('Grand');
    cy.contains('button', 'Rechercher').click();
  });
});
