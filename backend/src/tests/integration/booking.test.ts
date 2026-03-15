import request from 'supertest';
import app from '../../app';
import { setupTestDB } from '../setup';
import { createTestUser, createAdminUser } from '../helpers';

setupTestDB();

describe('API Réservations', () => {
  let hotelId: string;
  let adminToken: string;

  beforeEach(async () => {
    const admin = await createAdminUser();
    adminToken = admin.token;

    const hotelRes = await request(app)
      .post('/api/hotels')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Booking Test Hotel',
        location: 'Test City, Country',
        description: 'A hotel for testing bookings properly',
        picture_list: [],
      });

    hotelId = hotelRes.body.hotel.id;
  });

  const bookingData = () => ({
    hotelId,
    checkIn: new Date(Date.now() + 86400000).toISOString(),
    checkOut: new Date(Date.now() + 172800000).toISOString(),
    guests: 2,
  });

  describe('POST /api/bookings', () => {
    it('devrait créer une réservation pour l\'utilisateur connecté', async () => {
      const { token } = await createTestUser();

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData());

      expect(res.status).toBe(201);
      expect(res.body.booking).toBeDefined();
      expect(res.body.booking.status).toBe('pending');
    });

    it('devrait renvoyer 401 sans authentification', async () => {
      const res = await request(app)
        .post('/api/bookings')
        .send(bookingData());

      expect(res.status).toBe(401);
    });

    it('devrait renvoyer 404 pour un hôtel inexistant', async () => {
      const { token } = await createTestUser();

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...bookingData(),
          hotelId: 99999,
        });

      expect(res.status).toBe(404);
    });

    it('devrait renvoyer 400 pour des données invalides', async () => {
      const { token } = await createTestUser();

      const res = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send({
          hotelId,
          guests: 0,
        });

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/bookings', () => {
    it('devrait renvoyer uniquement les réservations de l\'utilisateur', async () => {
      const { token } = await createTestUser();
      const { token: token2 } = await createTestUser({
        email: 'other@test.com',
        pseudo: 'other',
      });

      // Créer une réservation pour l'utilisateur 1
      await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData());

      // Créer une réservation pour l'utilisateur 2
      await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token2}`)
        .send(bookingData());

      // L'utilisateur 1 ne doit voir que sa réservation
      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.bookings.length).toBe(1);
    });
  });

  describe('GET /api/bookings/:id', () => {
    it('devrait récupérer sa propre réservation par ID', async () => {
      const { token } = await createTestUser();

      const createRes = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData());

      const res = await request(app)
        .get(`/api/bookings/${createRes.body.booking.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('devrait refuser l\'affichage de la réservation d\'un autre utilisateur', async () => {
      const { token } = await createTestUser();
      const { token: token2 } = await createTestUser({
        email: 'other@test.com',
        pseudo: 'other',
      });

      const createRes = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData());

      const res = await request(app)
        .get(`/api/bookings/${createRes.body.booking.id}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(res.status).toBe(403);
    });

    it('devrait permettre à l\'admin de voir n\'importe quelle réservation', async () => {
      const { token } = await createTestUser();

      const createRes = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData());

      const res = await request(app)
        .get(`/api/bookings/${createRes.body.booking.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });

    it('devrait renvoyer 404 pour une réservation inexistante', async () => {
      const { token } = await createTestUser();

      const res = await request(app)
        .get('/api/bookings/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/bookings/search', () => {
    it('devrait permettre à l\'admin de rechercher des réservations par email', async () => {
      const { token } = await createTestUser();

      await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData());

      const res = await request(app)
        .get('/api/bookings/search?email=test@example.com')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.bookings.length).toBeGreaterThanOrEqual(1);
    });

    it('devrait refuser la recherche aux non-admins', async () => {
      const { token } = await createTestUser();

      const res = await request(app)
        .get('/api/bookings/search?email=test@test.com')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });

  describe('PUT /api/bookings/:id', () => {
    it('devrait permettre à l\'utilisateur de mettre à jour sa propre réservation', async () => {
      const { token } = await createTestUser();

      const createRes = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData());

      const res = await request(app)
        .put(`/api/bookings/${createRes.body.booking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ guests: 4 });

      expect(res.status).toBe(200);
      expect(res.body.booking.guests).toBe(4);
    });

    it('devrait refuser la mise à jour de la réservation d\'un autre utilisateur', async () => {
      const { token } = await createTestUser();
      const { token: token2 } = await createTestUser({
        email: 'other@test.com',
        pseudo: 'other',
      });

      const createRes = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData());

      const res = await request(app)
        .put(`/api/bookings/${createRes.body.booking.id}`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ guests: 4 });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/bookings/:id', () => {
    it('devrait permettre à l\'utilisateur de supprimer sa propre réservation', async () => {
      const { token } = await createTestUser();

      const createRes = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData());

      const res = await request(app)
        .delete(`/api/bookings/${createRes.body.booking.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('devrait refuser la suppression de la réservation d\'un autre utilisateur', async () => {
      const { token } = await createTestUser();
      const { token: token2 } = await createTestUser({
        email: 'other@test.com',
        pseudo: 'other',
      });

      const createRes = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData());

      const res = await request(app)
        .delete(`/api/bookings/${createRes.body.booking.id}`)
        .set('Authorization', `Bearer ${token2}`);

      expect(res.status).toBe(403);
    });

    it('devrait renvoyer 404 pour une réservation inexistante', async () => {
      const { token } = await createTestUser();

      const res = await request(app)
        .delete('/api/bookings/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
