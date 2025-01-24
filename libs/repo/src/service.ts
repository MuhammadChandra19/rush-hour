import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;
  private uri = 'mongodb://root:root@localhost:27017';
  private dbName = 'my-database';

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
