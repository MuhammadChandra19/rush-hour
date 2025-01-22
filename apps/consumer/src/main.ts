import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: `consumer-${Math.random()}`,
          brokers: ['localhost:9092'],
        },
        consumer: {
          allowAutoTopicCreation: true,
          groupId: 'consumer',
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
