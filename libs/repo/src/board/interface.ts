import { Board } from '../entity/board';

export abstract class IBoardRepository {
  abstract insertOne(document: Board): Promise<Board>;
  abstract findOne(id: string): Promise<Board | null>;
  abstract updateOne(id: string, document: Board): Promise<void>;
}
