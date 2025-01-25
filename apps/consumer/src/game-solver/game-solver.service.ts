import { Injectable, Logger } from '@nestjs/common';
import { IGameRepository } from '@rush-hour/cache/dist';
import { IBoardRepository } from '@rush-hour/repo/dist';
import { GameSolverPayload } from '@rush-hour/types/game';
import RushHourSolver from './core';

@Injectable()
export class GameSolverService {
  private readonly logger = new Logger(GameSolverService.name);
  constructor(
    private readonly gameRepo: IGameRepository,
    private readonly boardRepo: IBoardRepository,
  ) {}

  async calculatePlayerMove(payload: GameSolverPayload) {
    try {
      const game = await this.gameRepo.getGame(payload.gameID);

      if (!game) {
        return;
      }

      const board = await this.boardRepo.findOne(game.boardID);
      if (!board) {
        return;
      }

      const solver = new RushHourSolver(payload.board.board);
      const steps = solver.solve();

      if (game.steps.length > steps.length) {
        game.moveType = 'Good';
      } else if (game.steps.length === steps.length) {
        game.moveType = 'Waste';
      } else {
        game.moveType = 'Blunder';
      }
      const isSolved = solver.isSolved(payload.board.board);
      board.isSolved = isSolved;
      game.isSolved = isSolved;
      game.steps = steps;
      console.log(steps);

      await this.boardRepo.updateOne(game.boardID, board);
      await this.gameRepo.addOrUpdateGame(game);
    } catch (e) {
      this.logger.error(e);
    }
  }
}
