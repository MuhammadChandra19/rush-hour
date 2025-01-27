import { Injectable, Logger } from '@nestjs/common';
import { IGameRepository } from '@rush-hour/cache/dist';
import { IBoardRepository } from '@rush-hour/repo/dist';
import { Game, GameSolverPayload, MoveType, Step } from '@rush-hour/types/game';
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

      const { isSolved, moveType, steps } = this.caculatePlayerStep(
        payload.board.board,
        game,
      );

      board.isSolved = isSolved;
      game.moveType = moveType;
      game.isSolved = isSolved;
      game.steps = steps;

      await this.boardRepo.updateOne(game.boardID, board);
      await this.gameRepo.addOrUpdateGame(game);
    } catch (e) {
      this.logger.error(e);
    }
  }

  private caculatePlayerStep(
    playerBoard: number[][],
    game: Game,
  ): { moveType: MoveType; isSolved: boolean; steps: Step[] } {
    const playerGame = new RushHourSolver(playerBoard);
    const playerSteps = playerGame.solve();

    const board = new RushHourSolver(game.board.board);
    const actualSteps = board.solve();

    let comparedSteps: Step[];
    let moveType: MoveType;

    if (game.moveType === 'Unknown') {
      comparedSteps = actualSteps;
    }

    if (game.steps.length > playerSteps.length) {
      moveType = 'Good';
    } else if (game.steps.length === playerSteps.length) {
      moveType = 'Waste';
    } else {
      moveType = 'Blunder';
    }

    return {
      moveType,
      isSolved: playerGame.isSolved(playerBoard),
      steps: playerSteps,
    };
  }
}
