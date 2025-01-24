import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { GameSolverService } from './game-solver.service';
import { GameSolverPayload } from '@rush-hour/types/game';

@Controller('game-solver')
export class GameSolverController {
  private readonly logger = new Logger(GameSolverController.name);
  constructor(private readonly service: GameSolverService) {}

  @EventPattern('game.move')
  applyMove(msg: GameSolverPayload) {
    this.logger.log(msg.gameID);
  }
}
