import { User } from '../../models/User';
import { setupTestDB } from '../setup';

setupTestDB();

describe('Modèle Utilisateur', () => {
  it('devrait créer un utilisateur avec succès', async () => {
    const user = await User.create({
      email: 'test@example.com',
      pseudo: 'testuser',
      password: 'password123',
    });

    expect(user.email).toBe('test@example.com');
    expect(user.pseudo).toBe('testuser');
    expect(user.role).toBe('user');
    expect(user.password).not.toBe('password123'); // devrait être haché
  });

  it('devrait hacher le mot de passe avant d\'enregistrer', async () => {
    const user = await User.create({
      email: 'hash@test.com',
      pseudo: 'hashtest',
      password: 'mypassword',
    });

    expect(user.password).not.toBe('mypassword');
    expect(user.password.length).toBeGreaterThan(20);
  });

  it('devrait comparer les mots de passe correctement', async () => {
    const user = await User.create({
      email: 'compare@test.com',
      pseudo: 'comparetest',
      password: 'correctpassword',
    });

    const isMatch = await user.comparePassword('correctpassword');
    expect(isMatch).toBe(true);

    const isNotMatch = await user.comparePassword('wrongpassword');
    expect(isNotMatch).toBe(false);
  });

  it('devrait appliquer l\'unicité de l\'email', async () => {
    await User.create({
      email: 'unique@test.com',
      pseudo: 'user1',
      password: 'password123',
    });

    await expect(
      User.create({
        email: 'unique@test.com',
        pseudo: 'user2',
        password: 'password456',
      })
    ).rejects.toThrow();
  });

  it('devrait définir par défaut le rôle utilisateur', async () => {
    const user = await User.create({
      email: 'defaultrole@test.com',
      pseudo: 'defaultrole',
      password: 'password123',
    });

    expect(user.role).toBe('user');
  });

  it('devrait accepter les rôles valides', async () => {
    const admin = await User.create({
      email: 'admin@test.com',
      pseudo: 'admin',
      password: 'password123',
      role: 'admin',
    });
    expect(admin.role).toBe('admin');

    const employee = await User.create({
      email: 'employee@test.com',
      pseudo: 'employee',
      password: 'password123',
      role: 'employee',
    });
    expect(employee.role).toBe('employee');
  });

  it('devrait rejeter un rôle invalide', async () => {
    await expect(
      User.create({
        email: 'invalidrole@test.com',
        pseudo: 'invalidrole',
        password: 'password123',
        role: 'superadmin',
      })
    ).rejects.toThrow();
  });

  it('devrait exiger un email', async () => {
    await expect(
      User.create({
        pseudo: 'noemail',
        password: 'password123',
      })
    ).rejects.toThrow();
  });

  it('devrait exiger un pseudo', async () => {
    await expect(
      User.create({
        email: 'nopseudo@test.com',
        password: 'password123',
      })
    ).rejects.toThrow();
  });

  it('devrait exiger un mot de passe', async () => {
    await expect(
      User.create({
        email: 'nopassword@test.com',
        pseudo: 'nopassword',
      })
    ).rejects.toThrow();
  });

  it('devrait convertir l\'email en minuscules', async () => {
    const user = await User.create({
      email: 'UPPER@TEST.COM',
      pseudo: 'uppercase',
      password: 'password123',
    });

    expect(user.email).toBe('upper@test.com');
  });

  it('ne devrait pas retourner le mot de passe en JSON', async () => {
    const user = await User.create({
      email: 'json@test.com',
      pseudo: 'jsontest',
      password: 'password123',
    });

    const json = user.toJSON();
    expect(json.password).toBeUndefined();
  });

  it('ne devrait pas rehacher le mot de passe s\'il n\'a pas été modifié', async () => {
    const user = await User.create({
      email: 'norehash@test.com',
      pseudo: 'norehash',
      password: 'password123',
    });

    const originalHash = user.password;
    user.pseudo = 'updated';
    await user.save();

    expect(user.password).toBe(originalHash);
  });
});
