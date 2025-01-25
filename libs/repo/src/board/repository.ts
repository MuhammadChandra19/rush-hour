import { Injectable, Logger } from '@nestjs/common';
import { IBoardRepository } from './interface';
import { Board } from '../entity/board';
import { MongoService } from '../service';
import { InsertOneResult, ObjectId } from 'mongodb';

@Injectable()
export class BoardRepository implements IBoardRepository {
  protected collectionName = 'boards';
  private readonly logger = new Logger(BoardRepository.name);

  constructor(private readonly mongoService: MongoService) {}

  private get collection() {
    return this.mongoService.getCollection(this.collectionName);
  }
  async insertOne(document: Board): Promise<Board> {
    let result: Board = {
      board: document.board,
      _id: new ObjectId(),
      createdAt: document.createdAt,
      isSolved: false,
    };
    try {
      const res = (await this.collection.insertOne(document)) as InsertOneResult<Board>;
      result = {
        board: document.board,
        _id: res.insertedId,
        createdAt: document.createdAt,
        isSolved: document.isSolved,
      };
      return result;
    } catch (error: unknown) {
      this.logger.error(`Error occurred: ${error}`);
      return result;
    }
  }
  async findOne(id: string): Promise<Board | null> {
    try {
      const result = await this.collection.findOne<Board>({ _id: new ObjectId(id) });
      return result;
    } catch (error: unknown) {
      this.logger.error(`Error occurred: ${error}`);
      return null;
    }
  }

  async updateOne(id: string, document: Board): Promise<void> {
    try {
      this.collection.updateOne({ _id: new ObjectId(id) }, { $set: document });
    } catch (error: unknown) {
      this.logger.error(`Error occurred: ${error}`);
    }
  }
}
