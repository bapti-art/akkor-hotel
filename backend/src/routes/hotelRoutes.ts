import { Router } from 'express';
import {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../controllers/hotelController';
import { authenticate, authorize } from '../middleware/auth';
import {
  validate,
  createHotelSchema,
  updateHotelSchema,
} from '../middleware/validation';

const router = Router();

// Routes publiques (pas d'authentification requise)
router.get('/', getAllHotels);
router.get('/:id', getHotelById);

// Routes réservées aux administrateurs
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createHotelSchema),
  createHotel
);
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateHotelSchema),
  updateHotel
);
router.delete('/:id', authenticate, authorize('admin'), deleteHotel);

export default router;
