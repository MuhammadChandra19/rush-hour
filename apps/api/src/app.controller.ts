import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateBoardRequest, BoardResponse } from './dto/board';
import { GetGameResponse, UpdateGameRequest } from './dto/game';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('create-game')
  async createGame(
    @Body() boardBody: CreateBoardRequest,
  ): Promise<BoardResponse> {
    const id = (await this.appService.createBoard(boardBody)) as string;
    return {
      id,
      ...boardBody,
    };
  }

  @Get('game/:id')
  async getGame(@Param('id') id: string): Promise<GetGameResponse> {
    const game = await this.appService.getGame(id);
    if (game) {
      return {
        id: game.id,
        boardID: game.boardID,
        board: game.board.board,
        state: game.state || 'in-progress',
      };
    }

    return {
      id: '',
      board: [],
      boardID: '',
      state: 'Unknown',
    };
  }

  @Post('start-game/:id')
  async startGame(@Param('id') id: string): Promise<string> {
    const gameID = await this.appService.startGame(id);
    if (!gameID) {
      return 'board not found';
    }
    return gameID;
  }

  @Put('move-car/:id')
  async moveCar(
    @Param('id') id: string,
    @Body() board: UpdateGameRequest,
  ): Promise<boolean> {
    const isSolved = await this.appService.moveCar(id, {
      board: board.board,
    });
    return isSolved || false;
  }
}
