import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateBoardRequest, BoardResponse } from './dto/board';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('create-game')
  async createGame(
    @Body() boardBody: CreateBoardRequest,
  ): Promise<BoardResponse> {
    const id = (await this.appService.createGame(boardBody)) as string;
    return {
      id,
      ...boardBody,
    };
  }

  @Get('game/:id')
  async getGame(@Param('id') id: string): Promise<BoardResponse> {
    const board = await this.appService.getGame(id);
    if (board) {
      return {
        id: board._id?.toHexString() || '',
        board: board.board || [],
      };
    }

    return {
      id: '',
      board: [],
    };
  }
}
