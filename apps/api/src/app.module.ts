import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Partitioners } from 'kafkajs';
import {
  MongoService,
  BoardRepository,
  IBoardRepository,
} from '@rush-hour/repo/dist';
import {
  CacheService,
  GameRepository,
  IGameRepository,
} from '@rush-hour/cache/dist';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig } from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
    ClientsModule.registerAsync([
      {
        name: 'GAME_SOLVER',
        imports: [ConfigModule],
        useFactory: (config: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            producer: {
              allowAutoTopicCreation: true,
              createPartitioner: Partitioners.DefaultPartitioner,
            },
            client: {
              clientId: 'game.solver',
              brokers: config.get<string[]>('app.brokers') as string[],
            },
            consumer: {
              groupId: 'game.solver.consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: IBoardRepository,
      useFactory: (mongoService: MongoService) =>
        new BoardRepository(mongoService),
      inject: [MongoService],
    },
    {
      provide: IGameRepository,
      useFactory: (cache: CacheService) => new GameRepository(cache),
      inject: [CacheService],
    },
    CacheService,
    MongoService,
  ],
})
export class AppModule {}
