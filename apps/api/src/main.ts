import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Rush Hour API')
    .setDescription('The Rush Hour API description')
    .setVersion('1.0')
    .addTag('rush-hour')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  const configService = app.get(ConfigService);
  SwaggerModule.setup('docs', app, documentFactory);

  const port = configService.get<string>('app.port')!;
  const host = configService.get<string>('app.host')!;

  await app.listen(port, host);
}
bootstrap().catch(console.error);
