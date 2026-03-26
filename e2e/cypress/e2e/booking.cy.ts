describe('Flux de réservation', () => {
  const testUser = {
    email: `booking-e2e-${Date.now()}@test.com`,
    pseudo: `bookinguser${Date.now()}`,
    password: 'TestPassword123!',
  };

  before(() => {
    cy.register(testUser.email, testUser.pseudo, testUser.password);
  }); 

  beforeEach(() => {
    cy.login(testUser.email, testUser.password);
  });

  it('devrait créer une réservation depuis la page de détail d\'un hôtel', () => {
    cy.visit('/');
    cy.get('.hotel-card').first().click();
    cy.url().should('include', '/hotels/');
    cy.contains('button', 'Réserver Maintenant').click();
 
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const formatDate = (d: Date) => d.toISOString().split('T')[0];

    cy.get('input[type="date"]').first().type(formatDate(tomorrow));
    cy.get('input[type="date"]').last().type(formatDate(dayAfter));
    cy.get('input[type="number"]').clear().type('2');
    cy.contains('button', 'Confirmer la Réservation').click();

    cy.url().should('include', '/bookings');
  });

  it('devrait afficher les réservations sur la page "Mes réservations"', () => {
    cy.visit('/bookings');
    cy.get('.booking-card').should('have.length.at.least', 1);
  });

  it('devrait rediriger les utilisateurs non authentifiés depuis la page des réservations', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    cy.visit('/bookings');
    cy.url().should('include', '/login');
  });
});
