import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  if (!process.env.BROKERS) {
    throw new Error('BROKERS environment variable is required');
  }

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `consumer-${Math.random()}`,
          brokers: process.env.BROKERS?.split(',') || ['localhost:9092'],
          retry: {
            retries: 4,
          },
        },
        consumer: {
          allowAutoTopicCreation: true,
          groupId: 'consumer',
        },
      },
    },
  );
  app.enableShutdownHooks();
  await app.listen();
}
bootstrap().catch(console.error);
