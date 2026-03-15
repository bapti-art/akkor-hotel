import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { UserRole } from '../models/User';
import { config } from '../config';

export const createTestUser = async (
  overrides: Partial<{ email: string; pseudo: string; password: string; role: UserRole }> = {}
): Promise<{ user: IUser; token: string }> => {
  const userData = {
    email: overrides.email || 'test@example.com',
    pseudo: overrides.pseudo || 'testuser',
    password: overrides.password || 'password123',
    role: overrides.role || 'user',
  };

  const user = await User.create(userData);
  const token = jwt.sign({ id: user.id }, config.jwtSecret, {
    expiresIn: '1d',
  } as jwt.SignOptions);
 
  return { user, token };
};

export const createAdminUser = async (): Promise<{
  user: IUser;
  token: string;
}> => {
  return createTestUser({
    email: 'admin@test.com',
    pseudo: 'admin',
    role: 'admin',
  });
};

export const createEmployeeUser = async (): Promise<{
  user: IUser;
  token: string;
}> => {
  return createTestUser({
    email: 'employee@test.com',
    pseudo: 'employee',
    role: 'employee',
  });
};
