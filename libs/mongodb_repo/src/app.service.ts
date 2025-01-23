import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;

  constructor(
    private readonly uri: string,
    private readonly dbName: string
  ) {}

  async onModuleInit(): Promise<void> {
    this.client = new MongoClient(this.uri);
    await this.client.connect();
    this.db = this.client.db(this.dbName);
  }

  async onModuleDestroy(): Promise<void> {
    await this.client.close();
  }

  getCollection(collectionName: string) {
    return this.db.collection(collectionName);
  }
}
