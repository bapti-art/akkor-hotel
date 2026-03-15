import { Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { Hotel } from '../models/Hotel';
import { AuthRequest } from '../middleware/auth';

export const getAllHotels = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      sortBy = 'createdAt',
      order = 'desc',
      limit = '10',
      page = '1', 
      name,
      location,
    } = req.query;

    const where: Record<string, unknown> = {};
    if (name) where.name = { $regex: name as string, $options: 'i' };
    if (location) where.location = { $regex: location as string, $options: 'i' };

    const sortField = ['name', 'location', 'createdAt'].includes(
      sortBy as string
    )
      ? (sortBy as string)
      : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 10);
    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const offset = (pageNum - 1) * limitNum;

    const [hotels, total] = await Promise.all([
      Hotel.find(where)
        .sort({ [sortField]: sortOrder })
        .skip(offset)
        .limit(limitNum),
      Hotel.countDocuments(where),
    ]);

    res.json({
      hotels,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getHotelById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(404).json({ message: 'Hôtel non trouvé' });
      return;
    }

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      res.status(404).json({ message: 'Hôtel non trouvé' });
      return;
    }
    res.json({ hotel });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const createHotel = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, location, description, picture_list } = req.body;
    const hotel = await Hotel.create({ name, location, description, picture_list });
    res.status(201).json({ message: 'Hôtel créé avec succès', hotel });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateHotel = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(404).json({ message: 'Hôtel non trouvé' });
      return;
    }

    const hotel = await Hotel.findById(id);

    if (!hotel) {
      res.status(404).json({ message: 'Hôtel non trouvé' });
      return;
    }

    const { name, location, description, picture_list } = req.body;
    if (name) hotel.name = name;
    if (location) hotel.location = location;
    if (description) hotel.description = description;
    if (picture_list) hotel.picture_list = picture_list;

    await hotel.save();

    res.json({ message: 'Hôtel mis à jour avec succès', hotel });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteHotel = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(404).json({ message: 'Hôtel non trouvé' });
      return;
    }

    const hotel = await Hotel.findById(id);
    if (!hotel) {
      res.status(404).json({ message: 'Hôtel non trouvé' });
      return;
    }
    await hotel.deleteOne();
    res.json({ message: 'Hôtel supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
