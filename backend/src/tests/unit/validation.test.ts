import {
  registerSchema,
  loginSchema,
  updateUserSchema,
  createHotelSchema,
  updateHotelSchema,
  createBookingSchema,
  updateBookingSchema,
} from '../../middleware/validation';

describe('Schémas de Validation', () => {
  describe('registerSchema', () => {
    it('devrait accepter les données d\'enregistrement valides', () => {
      const { error } = registerSchema.validate({
        email: 'test@example.com',
        pseudo: 'testuser',
        password: 'password123',
      });
      expect(error).toBeUndefined();
    }); 

    it('devrait rejeter un email invalide', () => {
      const { error } = registerSchema.validate({
        email: 'not-an-email',
        pseudo: 'testuser',
        password: 'password123',
      });
      expect(error).toBeDefined();
    });

    it('devrait rejeter un email vide', () => {
      const { error } = registerSchema.validate({
        pseudo: 'testuser',
        password: 'password123',
      });
      expect(error).toBeDefined();
    });

    it('devrait rejeter un pseudo court', () => {
      const { error } = registerSchema.validate({
        email: 'test@example.com',
        pseudo: 'a',
        password: 'password123',
      });
      expect(error).toBeDefined();
    });

    it('devrait rejeter un mot de passe court', () => {
      const { error } = registerSchema.validate({
        email: 'test@example.com',
        pseudo: 'testuser',
        password: '12345',
      });
      expect(error).toBeDefined();
    });

    it('devrait rejeter un mot de passe manquant', () => {
      const { error } = registerSchema.validate({
        email: 'test@example.com',
        pseudo: 'testuser',
      });
      expect(error).toBeDefined();
    });
  });

  describe('loginSchema', () => {
    it('devrait accepter les données de connexion valides', () => {
      const { error } = loginSchema.validate({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(error).toBeUndefined();
    });

    it('devrait rejeter un email invalide', () => {
      const { error } = loginSchema.validate({
        email: 'invalid',
        password: 'password123',
      });
      expect(error).toBeDefined();
    });

    it('devrait rejeter un mot de passe manquant', () => {
      const { error } = loginSchema.validate({
        email: 'test@example.com',
      });
      expect(error).toBeDefined();
    });
  });

  describe('updateUserSchema', () => {
    it('devrait accepter les mises à jour partielles', () => {
      const { error } = updateUserSchema.validate({
        pseudo: 'newname',
      });
      expect(error).toBeUndefined();
    });

    it('devrait rejeter une mise à jour vide', () => {
      const { error } = updateUserSchema.validate({});
      expect(error).toBeDefined();
    });

    it('devrait rejeter un rôle invalide', () => {
      const { error } = updateUserSchema.validate({
        role: 'superadmin',
      });
      expect(error).toBeDefined();
    });
  });

  describe('createHotelSchema', () => {
    it('devrait accepter des données d\'hôtel valides', () => {
      const { error } = createHotelSchema.validate({
        name: 'Test Hotel',
        location: 'Test City',
        description: 'Un bel hôtel de test avec de très bons services',
        picture_list: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
      });
      expect(error).toBeUndefined();
    });

    it('devrait rejeter un nom manquant', () => {
      const { error } = createHotelSchema.validate({
        location: 'Test City',
        description: 'A lovely test hotel with great amenities',
      });
      expect(error).toBeDefined();
    });

    it('devrait rejeter une description trop courte', () => {
      const { error } = createHotelSchema.validate({
        name: 'Test Hotel',
        location: 'Test City',
        description: 'Court',
      });
      expect(error).toBeDefined();
    });

    it('devrait rejeter des URLs d\'image invalides', () => {
      const { error } = createHotelSchema.validate({
        name: 'Test Hotel',
        location: 'Test City',
        description: 'A lovely test hotel with great amenities',
        picture_list: ['not-a-url'],
      });
      expect(error).toBeDefined();
    });
  });

  describe('updateHotelSchema', () => {
    it('devrait accepter une mise à jour partielle', () => {
      const { error } = updateHotelSchema.validate({
        name: 'Updated Hotel',
      });
      expect(error).toBeUndefined();
    });

    it('devrait rejeter une mise à jour vide', () => {
      const { error } = updateHotelSchema.validate({});
      expect(error).toBeDefined();
    });
  });

  describe('createBookingSchema', () => {
    it('devrait accepter des données de réservation valides', () => {
      const { error } = createBookingSchema.validate({
        hotelId: 1,
        checkIn: new Date(Date.now() + 86400000).toISOString(),
        checkOut: new Date(Date.now() + 172800000).toISOString(),
        guests: 2,
      });
      expect(error).toBeUndefined();
    });

    it('devrait rejeter un hotelId invalide', () => {
      const { error } = createBookingSchema.validate({
        hotelId: -1,
        checkIn: new Date(Date.now() + 86400000).toISOString(),
        checkOut: new Date(Date.now() + 172800000).toISOString(),
        guests: 2,
      });
      expect(error).toBeDefined();
    });

    it('devrait rejeter 0 invité', () => {
      const { error } = createBookingSchema.validate({
        hotelId: 1,
        checkIn: new Date(Date.now() + 86400000).toISOString(),
        checkOut: new Date(Date.now() + 172800000).toISOString(),
        guests: 0,
      });
      expect(error).toBeDefined();
    });

    it('devrait rejeter trop d\'invités', () => {
      const { error } = createBookingSchema.validate({
        hotelId: 1,
        checkIn: new Date(Date.now() + 86400000).toISOString(),
        checkOut: new Date(Date.now() + 172800000).toISOString(),
        guests: 25,
      });
      expect(error).toBeDefined();
    });

    it('devrait rejeter un nombre négatif d\'invités', () => {
      const { error } = createBookingSchema.validate({
        hotelId: 1,
        checkIn: new Date(Date.now() + 86400000).toISOString(),
        checkOut: new Date(Date.now() + 172800000).toISOString(),
        guests: -1,
      });
      expect(error).toBeDefined();
    });

    it('devrait rejeter un hotelId manquant', () => {
      const { error } = createBookingSchema.validate({
        checkIn: new Date(Date.now() + 86400000).toISOString(),
        checkOut: new Date(Date.now() + 172800000).toISOString(),
        guests: 2,
      });
      expect(error).toBeDefined();
    });
  });

  describe('updateBookingSchema', () => {
    it('devrait accepter une mise à jour partielle de réservation', () => {
      const { error } = updateBookingSchema.validate({
        guests: 3,
      });
      expect(error).toBeUndefined();
    });

    it('devrait accepter une mise à jour du statut', () => {
      const { error } = updateBookingSchema.validate({
        status: 'confirmed',
      });
      expect(error).toBeUndefined();
    });

    it('devrait rejeter un statut invalide', () => {
      const { error } = updateBookingSchema.validate({
        status: 'invalid',
      });
      expect(error).toBeDefined();
    });

    it('devrait rejeter une mise à jour vide', () => {
      const { error } = updateBookingSchema.validate({});
      expect(error).toBeDefined();
    });
  });
});
