import { ApiProperty } from '@nestjs/swagger';
import { MoveType } from '@rush-hour/types/game';

export class GetGameResponse {
  @ApiProperty({ description: 'Game ID' })
  id: string;

  @ApiProperty({ description: 'Board ID' })
  boardID: string;

  @ApiProperty({ description: '2D array of numbers' })
  board: number[][];

  @ApiProperty({ description: 'Game state' })
  state: MoveType;
}

export class UpdateGameRequest {
  @ApiProperty({ description: '2D array of numbers' })
  board: number[][];
}

export class StartGameResponse {
  @ApiProperty({ description: 'Game ID' })
  id: string;

  @ApiProperty({
    description: 'Board',
    default: [
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0],
    ],
  })
  board: number[][];
}
