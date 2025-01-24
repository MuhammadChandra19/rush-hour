import { Module } from '@nestjs/common';
import { GameSolverService } from './game-solver.service';
import { GameSolverController } from './game-solver.controller';
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

@Module({
  providers: [
    GameSolverService,
    {
      provide: IBoardRepository,
      useFactory: (mongoService: MongoService) =>
        new BoardRepository(mongoService),
      inject: [MongoService],
    },
    MongoService,
    {
      provide: IGameRepository,
      useFactory: (cache: CacheService) => new GameRepository(cache),
      inject: [CacheService],
    },
    CacheService,
  ],
  controllers: [GameSolverController],
})
export class GameSolverModule {}
