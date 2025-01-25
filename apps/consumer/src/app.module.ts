import { Module } from '@nestjs/common';
import { GameSolverModule } from './game-solver/game-solver.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './config/app.config';

@Module({
  imports: [
    GameSolverModule,
    ConfigModule.forRoot({ isGlobal: true, load: [appConfig] }),
  ],
})
export class AppModule {}
