import request from 'supertest';
import app from '../../app';
import { setupTestDB } from '../setup';
import { createTestUser, createAdminUser, createEmployeeUser } from '../helpers';

setupTestDB();

describe('API Utilisateurs', () => {
  describe('GET /api/users/me', () => {
    it('devrait renvoyer le profil de l\'utilisateur courant', async () => {
      const { token } = await createTestUser();

      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('devrait renvoyer 401 sans jeton', async () => {
      const res = await request(app).get('/api/users/me');
      expect(res.status).toBe(401);
    });

    it('devrait renvoyer 401 avec un jeton invalide', async () => {
      const res = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalidtoken');

      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/users', () => {
    it('devrait permettre à un employé de lister tous les utilisateurs', async () => {
      await createTestUser();
      const { token } = await createEmployeeUser();

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.users.length).toBeGreaterThanOrEqual(2);
    });

    it('devrait permettre à l\'admin de lister tous les utilisateurs', async () => {
      const { token } = await createAdminUser();

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('devrait refuser à un utilisateur normal de lister tous les utilisateurs', async () => {
      const { token } = await createTestUser();

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });

  describe('GET /api/users/:id', () => {
    it('devrait permettre à l\'utilisateur de voir son propre profil', async () => {
      const { user, token } = await createTestUser();

      const res = await request(app)
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.user.email).toBe('test@example.com');
    });

    it('devrait permettre à un employé de voir n\'importe quel utilisateur', async () => {
      const { user } = await createTestUser();
      const { token } = await createEmployeeUser();

      const res = await request(app)
        .get(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('devrait refuser à un utilisateur normal de voir les profils des autres', async () => {
      const { token } = await createTestUser();
      const { user: otherUser } = await createTestUser({
        email: 'other@test.com',
        pseudo: 'other',
      });

      const res = await request(app)
        .get(`/api/users/${otherUser.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });

    it('devrait renvoyer 404 pour un utilisateur inexistant', async () => {
      const { token } = await createAdminUser();

      const res = await request(app)
        .get('/api/users/99999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });
  });

  describe('PUT /api/users/:id', () => {
    it('devrait permettre à l\'utilisateur de mettre à jour son propre profil', async () => {
      const { user, token } = await createTestUser();

      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ pseudo: 'updatedname' });

      expect(res.status).toBe(200);
      expect(res.body.user.pseudo).toBe('updatedname');
    });

    it('devrait permettre à l\'admin de mettre à jour n\'importe quel utilisateur', async () => {
      const { user } = await createTestUser();
      const { token } = await createAdminUser();

      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ pseudo: 'adminupdated' });

      expect(res.status).toBe(200);
    });

    it('devrait refuser à un utilisateur normal de mettre à jour les autres utilisateurs', async () => {
      const { token } = await createTestUser();
      const { user: otherUser } = await createTestUser({
        email: 'other@test.com',
        pseudo: 'other',
      });

      const res = await request(app)
        .put(`/api/users/${otherUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ pseudo: 'hacked' });

      expect(res.status).toBe(403);
    });

    it('devrait refuser à un non-admin de changer le rôle', async () => {
      const { user, token } = await createTestUser();

      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ role: 'admin' });

      expect(res.status).toBe(403);
    });

    it('devrait permettre à l\'admin de changer le rôle d\'un utilisateur', async () => {
      const { user } = await createTestUser();
      const { token } = await createAdminUser();

      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ role: 'employee' });

      expect(res.status).toBe(200);
      expect(res.body.user.role).toBe('employee');
    });

    it('devrait renvoyer 400 pour une mise à jour vide', async () => {
      const { user, token } = await createTestUser();

      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('devrait permettre à l\'utilisateur de supprimer son propre compte', async () => {
      const { user, token } = await createTestUser();

      const res = await request(app)
        .delete(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it('devrait refuser à un utilisateur de supprimer les comptes des autres', async () => {
      const { token } = await createTestUser();
      const { user: otherUser } = await createTestUser({
        email: 'other@test.com',
        pseudo: 'other',
      });

      const res = await request(app)
        .delete(`/api/users/${otherUser.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(403);
    });
  });
});
