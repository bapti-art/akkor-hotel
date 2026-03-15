import request from 'supertest';
import app from '../../app';
import { setupTestDB } from '../setup';

setupTestDB();

describe('API Authentification', () => {
  describe('POST /api/auth/register', () => {
    it('devrait enregistrer un nouvel utilisateur', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'newuser@test.com',
        pseudo: 'newuser',
        password: 'password123',
      });

      expect(res.status).toBe(201);
      expect(res.body.user).toBeDefined();
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('newuser@test.com');
      expect(res.body.user.password).toBeUndefined();
    });

    it('devrait renvoyer 409 pour un email dupliqué', async () => {
      await request(app).post('/api/auth/register').send({
        email: 'dup@test.com',
        pseudo: 'user1',
        password: 'password123',
      });

      const res = await request(app).post('/api/auth/register').send({
        email: 'dup@test.com',
        pseudo: 'user2',
        password: 'password456',
      });

      expect(res.status).toBe(409);
    });

    it('devrait renvoyer 400 pour un email invalide', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'not-an-email',
        pseudo: 'testuser',
        password: 'password123',
      });

      expect(res.status).toBe(400);
      expect(res.body.errors).toBeDefined();
    });

    it('devrait renvoyer 400 pour un mot de passe trop court', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'short@test.com',
        pseudo: 'testuser',
        password: '123',
      });

      expect(res.status).toBe(400);
    });

    it('devrait renvoyer 400 pour des champs manquants', async () => {
      const res = await request(app).post('/api/auth/register').send({
        email: 'missing@test.com',
      });

      expect(res.status).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        email: 'login@test.com',
        pseudo: 'loginuser',
        password: 'password123',
      });
    });

    it('devrait connecter avec des identifiants valides', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@test.com',
        password: 'password123',
      });

      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
      expect(res.body.user.email).toBe('login@test.com');
    });

    it('devrait renvoyer 401 pour un mauvais mot de passe', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'login@test.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
    });

    it('devrait renvoyer 401 pour un email inexistant', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'noexist@test.com',
        password: 'password123',
      });

      expect(res.status).toBe(401);
    });

    it('devrait renvoyer 400 pour un email manquant', async () => {
      const res = await request(app).post('/api/auth/login').send({
        password: 'password123',
      });

      expect(res.status).toBe(400);
    });

    it('devrait renvoyer 400 pour un format d\'email invalide', async () => {
      const res = await request(app).post('/api/auth/login').send({
        email: 'invalid-email',
        password: 'password123',
      });

      expect(res.status).toBe(400);
    });
  });
});
