import { Module } from '@nestjs/common';
import { GameCronService } from './game_cron.service';
import { GameCronController } from './game_cron.controller';
import { ScheduleModule } from '@nestjs/schedule';
import {
  CacheService,
  GameRepository,
  IGameRepository,
} from '@rush-hour/cache/dist';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [
    GameCronService,
    {
      provide: IGameRepository,
      useFactory: (cache: CacheService) => new GameRepository(cache),
      inject: [CacheService],
    },
    CacheService,
  ],
  controllers: [GameCronController],
})
export class GameCronModule {}
