import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT || 5432, // Default to 5432 if not provided
  logging: false, // Disable logging; set to console.log to see the raw SQL queries
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to PostgreSQL database successfully');
  } catch (err) {
    console.error('Failed to connect to PostgreSQL database:', err);
    throw err;
  }
};

export default sequelize;
