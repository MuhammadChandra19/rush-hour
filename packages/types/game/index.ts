import { BoardBody } from 'board';

export type Game = {
  id: string;
  boardID: string;
  board: BoardBody;
  state: 'Good' | 'Waste' | 'Blunder';
  steps: BoardBody[];
  updatedAt: Date;
};
