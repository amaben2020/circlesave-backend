import { registerAs } from '@nestjs/config';

const databaseConfig = registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  name: process.env.DATABASE_NAME,
  port: parseInt(process.env.DATABASE_PORT!),
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true' ? true : false,
}));

export default databaseConfig;
