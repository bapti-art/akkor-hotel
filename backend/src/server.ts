import app from './app';
import { connectDB } from './config/database';
import { config } from './config';

const start = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${config.port}`);
    console.log(
      `Documentation Swagger disponible à http://localhost:${config.port}/api-docs`
    ); 
  });
};

start().catch(console.error);
