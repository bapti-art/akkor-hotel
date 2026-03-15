import { connectDB, disconnectDB } from './config/database';
import { User } from './models/User';
import { Hotel } from './models/Hotel';
import { Booking } from './models/Booking';

const seed = async () => {
  await connectDB();

  await Booking.deleteMany({});
  await Hotel.deleteMany({});
  await User.deleteMany({});

  // Créer un utilisateur administrateur
  await User.create({
    email: 'admin@akkor-hotel.com',
    pseudo: 'admin',
    password: 'admin123',
    role: 'admin',
  });

  // Créer un utilisateur employé
  await User.create({
    email: 'employee@akkor-hotel.com',
    pseudo: 'employee',
    password: 'employee123',
    role: 'employee',
  });

  // Créer un utilisateur régulier
  await User.create({
    email: 'user@akkor-hotel.com',
    pseudo: 'user',
    password: 'user123',
    role: 'user',
  });

  // Créer des hôtels d'exemple
  const hotels = [
    {
      name: 'Grand Plaza Hôtel',
      location: 'Paris, France',
      description:
        'Un hôtel de luxe au cœur de Paris avec une vue spectaculaire sur la Tour Eiffel. Profitez d\'une cuisine gastronomique et de services de spa de classe mondiale.',
      picture_list: ['https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=2040&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    },
    {
      name: 'Station Balnéaire',
      location: 'Maldives',
      description:
        'Une station exclusive sur pilotis offrant des plages immaculées, des eaux cristallines et une détente ultime.',
      picture_list: ['https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    },
    {
      name: 'Refuge de Montagne',
      location: 'Alpes Suisses, Suisse',
      description:
        'Un refuge de montagne confortable idéal pour les amateurs de ski et les amoureux de la nature. Combine le charme rustique avec des équipements modernes.',
      picture_list: ['https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    },
    {
      name: 'Hôtel Tour de Tokyo',
      location: 'Tokyo, Japon',
      description:
        'Un hôtel moderne dans le quartier animé de Shibuya avec un service exceptionnel et l\'hospitalité japonaise traditionnelle.',
      picture_list: ['https://plus.unsplash.com/premium_photo-1661964402307-02267d1423f5?q=80&w=1546&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    },
    {
      name: 'Oasis du Désert',
      location: 'Dubaï, EAU',
      description:
        'Une retraite désertique somptueuse avec piscines à débordement, suites de luxe et vues spectaculaires au coucher du soleil sur les dunes.',
      picture_list: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
    },
  ];

  await Hotel.insertMany(hotels);

  console.log('Base de données remplie avec succès');
  await disconnectDB();
};

seed().catch(console.error);
