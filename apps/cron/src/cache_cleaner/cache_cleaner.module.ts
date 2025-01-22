import { Module } from '@nestjs/common';
import { CacheCleanerService } from './cache_cleaner.service';
import { CacheCleanerController } from './cache_cleaner.controller';

@Module({
  providers: [CacheCleanerService],
  controllers: [CacheCleanerController],
})
export class CacheCleanerModule {}
