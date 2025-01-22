import { Module } from '@nestjs/common';
import { CacheCleanerService } from './cache_cleaner.service';
import { CacheCleanerController } from './cache_cleaner.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [CacheCleanerService],
  controllers: [CacheCleanerController],
})
export class CacheCleanerModule {}
