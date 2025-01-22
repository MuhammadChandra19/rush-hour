import { Module } from '@nestjs/common';
import { CacheCleanerModule } from './cache_cleaner/cache_cleaner.module';

@Module({
  imports: [CacheCleanerModule],
})
export class AppModule {}
