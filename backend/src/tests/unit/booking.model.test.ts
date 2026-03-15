import { Booking } from '../../models/Booking';
import { User } from '../../models/User';
import { Hotel } from '../../models/Hotel';
import { setupTestDB } from '../setup';

setupTestDB();

describe('Modèle Réservation', () => {
  let userId: string;
  let hotelId: string;

  beforeEach(async () => {
    const user = await User.create({
      email: 'booker@test.com',
      pseudo: 'booker',
      password: 'password123',
    });
    userId = user.id;

    const hotel = await Hotel.create({
      name: 'Hôtel de Réservation',
      location: 'Ville de Test',
      description: 'Hôtel pour les tests de réservation avec suffisamment de caractères',
    });
    hotelId = hotel.id;
  });

  it('devrait créer une réservation avec succès', async () => {
    const booking = await Booking.create({
      userId,
      hotelId,
      checkIn: new Date('2026-06-01'),
      checkOut: new Date('2026-06-05'),
      guests: 2,
    });

    expect(String(booking.userId)).toBe(userId);
    expect(String(booking.hotelId)).toBe(hotelId);
    expect(booking.guests).toBe(2);
    expect(booking.status).toBe('pending');
  });

  it('devrait définir par défaut le statut "pending"', async () => {
    const booking = await Booking.create({
      userId,
      hotelId,
      checkIn: new Date('2026-07-01'),
      checkOut: new Date('2026-07-05'),
      guests: 1,
    });

    expect(booking.status).toBe('pending');
  });

  it('devrait accepter les statuts valides', async () => {
    const confirmed = await Booking.create({
      userId,
      hotelId,
      checkIn: new Date('2026-08-01'),
      checkOut: new Date('2026-08-05'),
      guests: 1,
      status: 'confirmed',
    });
    expect(confirmed.status).toBe('confirmed');

    const cancelled = await Booking.create({
      userId,
      hotelId,
      checkIn: new Date('2026-09-01'),
      checkOut: new Date('2026-09-05'),
      guests: 1,
      status: 'cancelled',
    });
    expect(cancelled.status).toBe('cancelled');
  });

  it('devrait rejeter un statut invalide', async () => {
    await expect(
      Booking.create({
        userId,
        hotelId,
        checkIn: new Date('2026-10-01'),
        checkOut: new Date('2026-10-05'),
        guests: 1,
        status: 'invalid',
      })
    ).rejects.toThrow();
  });

  it('devrait exiger au moins 1 invité', async () => {
    await expect(
      Booking.create({
        userId,
        hotelId,
        checkIn: new Date('2026-11-01'),
        checkOut: new Date('2026-11-05'),
        guests: 0,
      })
    ).rejects.toThrow();
  });

  it('devrait rejeter un nombre négatif d\'invités', async () => {
    await expect(
      Booking.create({
        userId,
        hotelId,
        checkIn: new Date('2026-12-01'),
        checkOut: new Date('2026-12-05'),
        guests: -1,
      })
    ).rejects.toThrow();
  });

  it('devrait exiger userId', async () => {
    await expect(
      Booking.create({
        hotelId,
        checkIn: new Date('2026-06-01'),
        checkOut: new Date('2026-06-05'),
        guests: 1,
      })
    ).rejects.toThrow();
  });

  it('devrait exiger hotelId', async () => {
    await expect(
      Booking.create({
        userId,
        checkIn: new Date('2026-06-01'),
        checkOut: new Date('2026-06-05'),
        guests: 1,
      })
    ).rejects.toThrow();
  });

  it('devrait exiger checkIn', async () => {
    await expect(
      Booking.create({
        userId,
        hotelId,
        checkOut: new Date('2026-06-05'),
        guests: 1,
      })
    ).rejects.toThrow();
  });

  it('devrait exiger checkOut', async () => {
    await expect(
      Booking.create({
        userId,
        hotelId,
        checkIn: new Date('2026-06-01'),
        guests: 1,
      })
    ).rejects.toThrow();
  });

  it('devrait avoir des horodatages', async () => {
    const booking = await Booking.create({
      userId,
      hotelId,
      checkIn: new Date('2026-06-01'),
      checkOut: new Date('2026-06-05'),
      guests: 2,
    });

    expect(booking.createdAt).toBeDefined();
    expect(booking.updatedAt).toBeDefined();
  });
});
