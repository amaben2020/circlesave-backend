import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });

console.log({
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  host: process.env.DATABASE_HOST,
});

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT!),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false, // Always false for production
  logging: true,
  // entities must be in the same directory as this file. /src/entities/*.ts
  entities: ['dist/src/entities/*.js'],
  // migrations must be in the same directory as this file. /db/migrations/*.ts
  migrations: ['dist/db/migrations/*.js'],
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
