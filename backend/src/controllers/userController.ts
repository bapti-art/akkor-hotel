import { Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getUserById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    if (
      String(req.user!.id) !== id &&
      req.user!.role !== 'employee' &&
      req.user!.role !== 'admin'
    ) {
      res.status(403).json({ message: 'Vous ne pouvez voir que votre propre profil' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getAllUsers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user!.role !== 'employee' && req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Permissions insuffisantes' });
      return;
    }

    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    if (String(req.user!.id) !== id && req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Vous ne pouvez mettre à jour que votre propre profil' });
      return;
    }

    if (req.body.role && req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Seuls les administrateurs peuvent modifier les rôles des utilisateurs' });
      return;
    }

    const user = await User.findById(id).select('+password');
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    const { email, pseudo, password, role } = req.body;
    if (email) user.email = email;
    if (pseudo) user.pseudo = pseudo;
    if (password) user.password = password;
    if (role && req.user!.role === 'admin') user.role = role;

    await user.save();

    res.json({ message: 'Utilisateur mis à jour avec succès', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    if (String(req.user!.id) !== id) {
      res.status(403).json({ message: 'Vous ne pouvez supprimer que votre propre compte' });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }
 
    await user.deleteOne();

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
