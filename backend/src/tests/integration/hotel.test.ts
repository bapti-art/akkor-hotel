import request from 'supertest';
import app from '../../app';
import { setupTestDB } from '../setup';
import { createTestUser, createAdminUser } from '../helpers';

setupTestDB();

const sampleHotel = {
  name: 'Refuge de Montagne',
  location: 'Alpes Suisses, Suisse',
  description: 'Un refuge de montagne confortable idéal pour les amateurs de ski et les amoureux de la nature. Combine le charme rustique avec des équipements modernes.',
  picture_list: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
};

describe('API Hôtels', () => {
  describe('GET /api/hotels', () => {
    it('devrait lister les hôtels sans authentification', async () => {
      const res = await request(app).get('/api/hotels');

      expect(res.status).toBe(200);
      expect(res.body.hotels).toBeDefined();
      expect(res.body.pagination).toBeDefined();
    });

    it('devrait renvoyer une limite par défaut de 10', async () => {
      const { token } = await createAdminUser();

      // Creer 12 hotels
      for (let i = 0; i < 12; i++) {
        await request(app)
          .post('/api/hotels')
          .set('Authorization', `Bearer ${token}`)
          .send({
            ...sampleHotel,
            name: `Hotel ${i}`,
          });
      }

      const res = await request(app).get('/api/hotels');

      expect(res.status).toBe(200);
      expect(res.body.hotels.length).toBe(10);
      expect(res.body.pagination.total).toBe(12);
    });

    it('devrait supporter une limite personnalisée', async () => {
      const { token } = await createAdminUser();

      for (let i = 0; i < 5; i++) {
        await request(app)
          .post('/api/hotels')
          .set('Authorization', `Bearer ${token}`)
          .send({ ...sampleHotel, name: `Hotel ${i}` });
      }

      const res = await request(app).get('/api/hotels?limit=3');

      expect(res.status).toBe(200);
      expect(res.body.hotels.length).toBe(3);
    });

    it('devrait supporter le tri par nom', async () => {
      const { token } = await createAdminUser();

      await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleHotel, name: 'Zebra Hotel' });

      await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleHotel, name: 'Alpha Hotel' });

      const res = await request(app).get(
        '/api/hotels?sortBy=name&order=asc'
      );

      expect(res.status).toBe(200);
      expect(res.body.hotels[0].name).toBe('Alpha Hotel');
    });

    it('devrait supporter le filtrage par nom', async () => {
      const { token } = await createAdminUser();

      await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleHotel, name: 'Unique Name Hotel' });

      await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleHotel, name: 'Other Hotel' });

      const res = await request(app).get('/api/hotels?name=Unique');

      expect(res.status).toBe(200);
      expect(res.body.hotels.length).toBe(1);
      expect(res.body.hotels[0].name).toBe('Unique Name Hotel');
    });

    it('devrait supporter le filtrage par lieu', async () => {
      const { token } = await createAdminUser();

      await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleHotel, location: 'Paris, France' });

      await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...sampleHotel, name: 'Tokyo Hotel', location: 'Tokyo, Japan' });

      const res = await request(app).get('/api/hotels?location=Paris');

      expect(res.status).toBe(200);
      expect(res.body.hotels.length).toBe(1);
    });
  });

  describe('GET /api/hotels/:id', () => {
    it('devrait récupérer un hôtel par ID sans authentification', async () => {
      const { token } = await createAdminUser();

      const createRes = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleHotel);

      const res = await request(app).get(
        `/api/hotels/${createRes.body.hotel.id}`
      );

      expect(res.status).toBe(200);
      expect(res.body.hotel.name).toBe(sampleHotel.name);
    });

    it('devrait renvoyer 404 pour un hôtel inexistant', async () => {
      const res = await request(app).get(
        '/api/hotels/99999'
      );

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/hotels', () => {
    it('devrait permettre à l\'admin de créer un hôtel', async () => {
      const { token } = await createAdminUser();

      const res = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleHotel);

      expect(res.status).toBe(201);
      expect(res.body.hotel.name).toBe(sampleHotel.name);
    });

    it('devrait refuser la création d\'un hôtel aux non-admins', async () => {
      const { token } = await createTestUser();

      const res = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleHotel);

      expect(res.status).toBe(403);
    });

    it('devrait renvoyer 401 sans authentification', async () => {
      const res = await request(app).post('/api/hotels').send(sampleHotel);

      expect(res.status).toBe(401);
    });

    it('devrait renvoyer 400 pour des champs obligatoires manquants', async () => {
      const { token } = await createAdminUser();

      const res = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Only Name' });

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/hotels/:id', () => {
    it('devrait permettre à l\'admin de mettre à jour un hôtel', async () => {
      const { token } = await createAdminUser();

      const createRes = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleHotel);

      const res = await request(app)
        .put(`/api/hotels/${createRes.body.hotel.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Updated Hotel' });

      expect(res.status).toBe(200);
      expect(res.body.hotel.name).toBe('Updated Hotel');
    });

    it('devrait refuser la mise à jour d\'un hôtel aux non-admins', async () => {
      const adminData = await createAdminUser();
      const { token: userToken } = await createTestUser();

      const createRes = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${adminData.token}`)
        .send(sampleHotel);

      const res = await request(app)
        .put(`/api/hotels/${createRes.body.hotel.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ name: 'Hacked Name' });

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/hotels/:id', () => {
    it('devrait permettre à l\'admin de supprimer un hôtel', async () => {
      const { token } = await createAdminUser();

      const createRes = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${token}`)
        .send(sampleHotel);

      const res = await request(app)
        .delete(`/api/hotels/${createRes.body.hotel.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('devrait refuser la suppression d\'un hôtel aux non-admins', async () => {
      const adminData = await createAdminUser();
      const { token: userToken } = await createTestUser();

      const createRes = await request(app)
        .post('/api/hotels')
        .set('Authorization', `Bearer ${adminData.token}`)
        .send(sampleHotel);

      const res = await request(app)
        .delete(`/api/hotels/${createRes.body.hotel.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(res.status).toBe(403);
    });

    it('devrait renvoyer 404 pour un hôtel inexistant', async () => {
      const { token } = await createAdminUser();

      const res = await request(app)
        .delete('/api/hotels/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });
});
