import { Collection, Document, Filter, OptionalUnlessRequiredId, UpdateFilter, WithId } from 'mongodb';

export abstract class IMongoService {
  abstract getCollection(collectionName: string): Collection<Document>;
}
