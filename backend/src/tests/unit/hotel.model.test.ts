import { Hotel } from '../../models/Hotel';
import { setupTestDB } from '../setup';

setupTestDB();

describe('Modèle Hôtel', () => {
  it('devrait créer un hôtel avec succès', async () => {
    const hotel = await Hotel.create({
      name: 'Hôtel de Test',
      location: 'Ville de Test',
      description: 'Un excellent hôtel pour les besoins de test',
      picture_list: ['https://example.com/pic1.jpg'],
    });

    expect(hotel.name).toBe('Hôtel de Test');
    expect(hotel.location).toBe('Ville de Test');
    expect(hotel.description).toBe('Un excellent hôtel pour les besoins de test');
    expect(hotel.picture_list).toHaveLength(1);
  });

  it('devrait par défaut initialiser picture_list à un tableau vide', async () => {
    const hotel = await Hotel.create({
      name: 'Hôtel Sans Images',
      location: 'Quelque part',
      description: 'Un hôtel sans aucune image',
    });

    expect(hotel.picture_list).toEqual([]);
  });

  it('devrait exiger un nom', async () => {
    await expect(
      Hotel.create({
        location: 'Ville de Test',
        description: 'Description d\'hôtel sans nom',
      })
    ).rejects.toThrow();
  });

  it('devrait exiger un lieu', async () => {
    await expect(
      Hotel.create({
        name: 'Sans Lieu',
        description: 'Description d\'hôtel sans lieu',
      })
    ).rejects.toThrow();
  });

  it('devrait exiger une description', async () => {
    await expect(
      Hotel.create({
        name: 'Sans Description',
        location: 'Quelque part',
      })
    ).rejects.toThrow();
  });

  it('devrait avoir des horodatages', async () => {
    const hotel = await Hotel.create({
      name: 'Hôtel Horodaté',
      location: 'Ville du Temps',
      description: 'Hôtel avec horodatages pour les besoins de test',
    });

    expect(hotel.createdAt).toBeDefined();
    expect(hotel.updatedAt).toBeDefined();
  });

  it('devrait stocker plusieurs images', async () => {
    const pictures = [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1661964402307-02267d1423f5?q=80&w=1546&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ];

    const hotel = await Hotel.create({
      name: 'Hôtel Multi-Images',
      location: 'Ville des Images',
      description: 'Un hôtel avec plusieurs images enregistrées',
      picture_list: pictures,
    });

    expect(hotel.picture_list).toHaveLength(3);
    expect(hotel.picture_list).toEqual(pictures);
  });
});
