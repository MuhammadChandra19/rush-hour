import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { IGameRepository } from '@rush-hour/cache/dist';
import { Board, IBoardRepository } from '@rush-hour/repo/dist';
import { BoardBody } from '@rush-hour/types/board';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(
    @Inject('GAME_SOLVER') private readonly gameSolverClient: ClientKafka,
    private readonly boardRepository: IBoardRepository,
    private readonly gameRepository: IGameRepository,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createBoard(board: BoardBody) {
    try {
      const newBoard: Board = {
        board: board.board,
        createdAt: new Date(),
        isSolved: false,
      };
      const result = await this.boardRepository.insertOne(newBoard);

      return result._id?.toHexString();
    } catch (error: unknown) {
      // Explicitly type error as `unknown`
      if (error instanceof Error) {
        // Access properties safely
        this.logger.error(`Error occurred: ${error.message}`, error.stack);
      } else {
        // Handle non-Error objects
        this.logger.error(`Unexpected error: ${JSON.stringify(error)}`);
      }
    }
  }

  async getGame(id: string) {
    try {
      const result = await this.gameRepository.getGame(id);
      return result;
    } catch (error: unknown) {
      // Explicitly type error as `unknown`
      if (error instanceof Error) {
        // Access properties safely
        this.logger.error(`Error occurred: ${error.message}`, error.stack);
      } else {
        // Handle non-Error objects
        this.logger.error(`Unexpected error: ${JSON.stringify(error)}`);
      }
    }
  }

  async startGame(boardID: string) {
    try {
      const board = await this.boardRepository.findOne(boardID);
      if (!board) {
        return '';
      }
      const gameID = `${boardID}-game`;
      await this.gameRepository.addOrUpdateGame({
        boardID,
        board,
        state: 'Unknown',
        id: gameID,
        steps: [],
        updatedAt: new Date(),
      });

      return gameID;
    } catch (error: unknown) {
      // Explicitly type error as `unknown`
      if (error instanceof Error) {
        // Access properties safely
        this.logger.error(`Error occurred: ${error.message}`, error.stack);
      } else {
        // Handle non-Error objects
        this.logger.error(`Unexpected error: ${JSON.stringify(error)}`);
      }
    }
  }

  async moveCar(gameID: string) {
    try {
      let solved = false;
      const result = await this.gameRepository.getGame(gameID);
      if (result) {
        const board = await this.boardRepository.findOne(result.boardID);
        solved = board?.isSolved || false;
      }

      if (!solved) {
        this.gameSolverClient.emit('game.move', gameID);
      }

      return solved;
    } catch (error: unknown) {
      // Explicitly type error as `unknown`
      if (error instanceof Error) {
        // Access properties safely
        this.logger.error(`Error occurred: ${error.message}`, error.stack);
      } else {
        // Handle non-Error objects
        this.logger.error(`Unexpected error: ${JSON.stringify(error)}`);
      }
    }
  }
}
