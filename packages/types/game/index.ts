import { BoardBody } from '../board';

export type GameState = 'Good' | 'Waste' | 'Blunder';

export type Game = {
  id: string;
  boardID: string;
  board: BoardBody;
  state: GameState;
  steps: BoardBody[];
  updatedAt: Date;
};
