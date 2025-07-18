import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load environment variables dari file .env
dotenv.config(); // <-- Cukup ini

// Buat koneksi Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log,
    dialectOptions: {
      connectTimeout: 30000,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  }
);

export default sequelize;
