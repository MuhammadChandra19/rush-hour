import { registerAs } from '@nestjs/config';

export interface AppConfig {
  env: 'development' | 'production' | 'test';
  port: number;
}

export const appConfig = registerAs(
  'app',
  () =>
    ({
      // App
      env: process.env.NODE_ENV || 'development',
      port: parseInt(process.env.PORT!) || 8888,
      host: process.env.HOST || '0.0.0.0',
      brokers: process.env.BROKERS?.split(',') || ['localhost:9092'],
      redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
      dbName: process.env.DB_NAME || 'my-database',
      dbPath: process.env.DB_PATH || 'mongodb://root:root@localhost:27017',
    }) as AppConfig,
);
