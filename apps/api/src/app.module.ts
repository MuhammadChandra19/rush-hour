import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  MongoService,
  BoardRepository,
  IBoardRepository,
} from '@rush-hour/repo/dist';

@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: IBoardRepository,
      useFactory: (mongoService: MongoService) =>
        new BoardRepository(mongoService),
      inject: [MongoService],
    },
    {
      provide: MongoService,
      useFactory: () =>
        new MongoService('mongodb://root:root@localhost:27017', 'my-database'), // Default URI and DB name
    },
  ],
})
export class AppModule {}
