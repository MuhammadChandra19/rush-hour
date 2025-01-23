import { Injectable, Logger } from '@nestjs/common';
import { Board, IBoardRepository } from '@rush-hour/repo/dist';
import { BoardBody } from '@rush-hour/types/board';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor(private readonly boardRepository: IBoardRepository) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createGame(board: BoardBody) {
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
      const result = await this.boardRepository.findOne(id);
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
}
