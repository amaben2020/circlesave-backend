import { registerAs } from '@nestjs/config';

const appConfig = registerAs('appConfig', () => ({
  environment: process.env.NODE_ENV || 'development',
}));

export default appConfig;
