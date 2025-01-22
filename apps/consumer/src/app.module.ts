import { Module } from '@nestjs/common';
import { GameSolverModule } from './game-solver/game-solver.module';

@Module({
  imports: [GameSolverModule],
})
export class AppModule {}
