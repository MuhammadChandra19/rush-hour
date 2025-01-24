import { Controller, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { GameSolverService } from './game-solver.service';

@Controller('game-solver')
export class GameSolverController {
  private readonly logger = new Logger(GameSolverController.name);
  constructor(private readonly service: GameSolverService) {}

  @EventPattern('game.move')
  applyMove(msg: any) {
    this.logger.log(`Received: ${msg}`);
  }
}
