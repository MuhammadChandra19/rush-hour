import { ApiProperty } from '@nestjs/swagger';
import { GameState } from '@rush-hour/types/game';

export class GetGameResponse {
  @ApiProperty({ description: 'Game ID' })
  id: string;

  @ApiProperty({ description: 'Board ID' })
  boardID: string;

  @ApiProperty({ description: '2D array of numbers' })
  board: number[][];

  @ApiProperty({ description: 'Game state' })
  state: GameState;
}

export class UpdateGameRequest {
  @ApiProperty({ description: '2D array of numbers' })
  board: number[][];
}
