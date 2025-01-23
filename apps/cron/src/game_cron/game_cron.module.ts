import { Module } from '@nestjs/common';
import { GameCronService } from './game_cron.service';
import { GameCronController } from './game_cron.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [GameCronService],
  controllers: [GameCronController],
})
export class GameCronModule {}
