import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient, Db } from 'mongodb';

@Injectable()
export class MongoService implements OnModuleInit, OnModuleDestroy {
  private client: MongoClient;
  private db: Db;
  private uri: string;
  private dbName: string;

  constructor(private configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    this.createVariables();

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

  private createVariables = () => {
    this.uri = this.configService.get<string>('app.dbPath')!;
    this.dbName = this.configService.get<string>('app.dbName')!;
  };
}
