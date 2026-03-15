import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';

const genererJeton = (id: string): string => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  } as jwt.SignOptions);
}; 

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, pseudo, password } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ message: 'Email déjà enregistré' });
      return;
    }

    const user = await User.create({ email, pseudo, password });
    const token = genererJeton(user.id);

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Email ou mot de passe invalide' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Email ou mot de passe invalide' });
      return;
    }

    const token = genererJeton(user.id);

    res.json({
      message: 'Connexion réussie',
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
