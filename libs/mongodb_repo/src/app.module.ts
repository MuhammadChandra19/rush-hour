import { Global, Module } from '@nestjs/common';
import { MongoService } from './app.service';

@Global() // Make this module globally available
@Module({
  providers: [
    {
      provide: MongoService,
      useFactory: () => new MongoService('mongodb://localhost:27017', 'my-database'), // Default URI and DB name
    },
  ],
  exports: [MongoService],
})
export class MongoModule {}
