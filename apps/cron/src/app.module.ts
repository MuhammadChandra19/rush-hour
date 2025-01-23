import { Module } from '@nestjs/common';
import { GameCronModule } from './game_cron/game_cron.module';

@Module({
  imports: [GameCronModule],
})
export class AppModule {}
