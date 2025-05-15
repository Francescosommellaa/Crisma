import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME!, 
  process.env.DB_USER!, 
  process.env.DB_PASSWORD!, 
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: parseInt(process.env.DB_PORT!),
    logging: console.log, 
  }
);

// Test di Connessione al Database
sequelize.authenticate()
  .then(() => console.log('✅ Database connesso con successo'))
  .catch((err) => console.error('❌ Errore connessione DB:', err));

export default sequelize;