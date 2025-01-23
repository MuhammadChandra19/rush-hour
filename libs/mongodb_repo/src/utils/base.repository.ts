import { Document, Filter, OptionalUnlessRequiredId, UpdateFilter } from 'mongodb';
import { MongoService } from '../app.service';

export abstract class BaseRepository<T extends Document> {
  protected abstract collectionName: string;

  constructor(private readonly mongoService: MongoService) {}

  private get collection() {
    return this.mongoService.getCollection(this.collectionName);
  }

  async find(filter: Filter<T>) {
    return this.collection.find(filter).toArray();
  }

  async findOne(filter: Filter<T>): Promise<T | null> {
    return this.collection.findOne<T>(filter);
  }

  async insertOne(document: OptionalUnlessRequiredId<T>): Promise<void> {
    await this.collection.insertOne(document);
  }

  async updateOne(filter: Filter<T>, update: UpdateFilter<Document>): Promise<void> {
    await this.collection.updateOne(filter, update);
  }

  async deleteOne(filter: Filter<T>): Promise<void> {
    await this.collection.deleteOne(filter);
  }
}
