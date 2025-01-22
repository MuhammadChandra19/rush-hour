import { Module } from '@nestjs/common';
import { GameSolverService } from './game-solver.service';
import { GameSolverController } from './game-solver.controller';

@Module({
  providers: [GameSolverService],
  controllers: [GameSolverController],
})
export class GameSolverModule {}
