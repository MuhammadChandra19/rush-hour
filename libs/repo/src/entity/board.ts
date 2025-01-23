import { ObjectId } from 'mongodb';

export interface Board {
  _id?: ObjectId;
  board: number[][]; // 2D array of numbers
  isSolved: boolean;
  createdAt: Date;
}
