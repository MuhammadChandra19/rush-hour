import { Controller } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { GameSolverService } from './game-solver.service';
import { GameSolverPayload } from '@rush-hour/types/game';

@Controller('game-solver')
export class GameSolverController {
  constructor(private readonly service: GameSolverService) {}

  @EventPattern('game.move')
  applyMove(msg: GameSolverPayload) {
    console.log(msg);
    this.service.calculatePlayerMove(msg);
  }
}
