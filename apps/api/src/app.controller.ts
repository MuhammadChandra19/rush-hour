import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateBoardRequest, BoardResponse } from './dto/board';
import {
  GetGameResponse,
  StartGameResponse,
  UpdateGameRequest,
} from './dto/game';

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

  @Post('start-game/:boardID')
  async startGame(
    @Param('boardID') boardID: string,
  ): Promise<StartGameResponse> {
    const game = await this.appService.startGame(boardID);
    if (!game) {
      return { board: [], id: '' };
    }
    return {
      board: game.board!,
      id: game.gameID!,
    };
  }

  @Put('move-car/:gameID')
  async moveCar(
    @Param('gameID') gameID: string,
    @Body() board: UpdateGameRequest,
  ): Promise<boolean> {
    const isSolved = await this.appService.moveCar(gameID, {
      board: board.board,
    });
    return isSolved || false;
  }

  @Get('game/:id')
  async getGame(@Param('id') id: string): Promise<GetGameResponse> {
    const game = await this.appService.getGame(id);
    if (game) {
      return {
        id: game.id,
        boardID: game.boardID,
        board: game.board.board,
        state: game.moveType,
      };
    }

    return {
      id: '',
      board: [],
      boardID: '',
      state: 'Unknown',
    };
  }
}
