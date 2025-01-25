import { Module } from '@nestjs/common';
import { GameCronModule } from './game_cron/game_cron.module';
import { appConfig } from './config/app.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GameCronModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
  ],
})
export class AppModule {}
