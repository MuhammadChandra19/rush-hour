import { Module } from '@nestjs/common';
import { GameCronModule } from './game_cron/cache_cleaner.module';

@Module({
  imports: [GameCronModule],
})
export class AppModule {}
