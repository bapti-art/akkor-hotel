import { Router } from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  searchBookings,
  updateBooking,
  deleteBooking,
} from '../controllers/bookingController';
import { authenticate } from '../middleware/auth';
import {
  validate,
  createBookingSchema,
  updateBookingSchema,
} from '../middleware/validation'; 

const router = Router();

// Toutes les routes de réservation nécessitent une authentification
router.use(authenticate);

router.post('/', validate(createBookingSchema), createBooking);
router.get('/', getMyBookings);
router.get('/search', searchBookings);
router.get('/:id', getBookingById);
router.put('/:id', validate(updateBookingSchema), updateBooking);
router.delete('/:id', deleteBooking);

export default router;
