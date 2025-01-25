import { BoardBody } from '../board';

export type MoveType = 'Unknown' | 'Good' | 'Waste' | 'Blunder';
export enum MovementDirection {
  Up,
  Right,
  Down,
  Left,
}

export interface Step {
  carId: number;
  direction: MovementDirection;
}

export type Game = {
  id: string;
  boardID: string;
  board: BoardBody;
  moveType: MoveType;
  steps: Step[];
  isSolved: boolean;
  updatedAt: Date;
};

export type GameSolverPayload = {
  gameID: string;
  board: BoardBody;
};
