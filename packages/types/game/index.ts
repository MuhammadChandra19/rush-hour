import { BoardBody } from '../board';

export type GameState = 'Unknown' | 'Good' | 'Waste' | 'Blunder';
enum MovementDirection {
  Up,
  Right,
  Down,
  Left,
}

interface Step {
  carId: number;
  direction: MovementDirection;
}

export type Game = {
  id: string;
  boardID: string;
  board: BoardBody;
  state: GameState;
  steps: Step[];
  updatedAt: Date;
};
