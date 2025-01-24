import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'GAME_SOLVER',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'game.solver',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'game.solver.consumer',
          },
        },
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
