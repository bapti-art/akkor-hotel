import { Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { Booking } from '../models/Booking';
import { Hotel } from '../models/Hotel';
import { User } from '../models/User';
import { AuthRequest } from '../middleware/auth';

export const createBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { hotelId, checkIn, checkOut, guests } = req.body;

    if (!isValidObjectId(String(hotelId))) {
      res.status(404).json({ message: 'Hôtel non trouvé' });
      return;
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      res.status(404).json({ message: 'Hôtel non trouvé' });
      return;
    }

    const booking = await Booking.create({
      userId: req.user!.id,
      hotelId,
      checkIn,
      checkOut,
      guests,
    });

    res.status(201).json({ message: 'Réservation créée avec succès', booking });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getMyBookings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const bookings = await Booking.find({
      userId: req.user!.id,
    }).populate('hotel', 'name location');
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const getBookingById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    const booking = await Booking.findById(id)
      .populate('hotel', 'name location')
      .populate('user', 'email pseudo');

    if (!booking) {
      res.status(404).json({ message: 'Booking not found' });
      return;
    }

    if (
      req.user!.role !== 'admin' &&
      String(booking.userId) !== String(req.user!.id)
    ) {
      res.status(403).json({ message: 'Vous ne pouvez voir que vos propres réservations' });
      return;
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const searchBookings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Permissions insuffisantes' });
      return;
    }

    const { email, name, userId } = req.query;
    const where: Record<string, unknown> = {};

    if (userId) {
      if (isValidObjectId(String(userId))) {
        where.userId = userId;
      } else {
        res.json({ bookings: [] });
        return;
      }
    } else if (email || name) {
      const userWhere: Record<string, unknown> = {};
      if (email) userWhere.email = { $regex: email as string, $options: 'i' };
      if (name) userWhere.pseudo = { $regex: name as string, $options: 'i' };
      const users = await User.find(userWhere).select('_id');
      const userIds = users.map((u) => u._id);
      where.userId = { $in: userIds };
    }

    const bookings = await Booking.find(where)
      .populate('hotel', 'name location')
      .populate('user', 'email pseudo');

    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const updateBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(404).json({ message: 'Reservation non trouvée' });
      return;
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      res.status(404).json({ message: 'Reservation non trouvée' });
      return;
    }

    if (
      req.user!.role !== 'admin' &&
      String(booking.userId) !== String(req.user!.id)
    ) {
      res
        .status(403)
        .json({ message: 'Vous ne pouvez mettre à jour que vos propres réservations' });
      return;
    }

    const { checkIn, checkOut, guests, status } = req.body;
    if (checkIn) booking.checkIn = checkIn;
    if (checkOut) booking.checkOut = checkOut;
    if (guests) booking.guests = guests;
    if (status) booking.status = status;

    await booking.save();

    res.json({ message: 'Réservation mise à jour avec succès', booking });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

export const deleteBooking = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      res.status(404).json({ message: 'Réservation non trouvée' });
      return;
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      res.status(404).json({ message: 'Réservation non trouvée' });
      return;
    }

    if (
      req.user!.role !== 'admin' &&
      String(booking.userId) !== String(req.user!.id)
    ) {
      res
        .status(403)
        .json({ message: 'Vous ne pouvez supprimer que vos propres réservations' });
      return;
    }

    await booking.deleteOne();

    res.json({ message: 'Réservation supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
