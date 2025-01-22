import { Controller, Logger } from '@nestjs/common';
import { CacheCleanerService } from './cache_cleaner.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('cache-cleaner')
export class CacheCleanerController {
  private readonly logger = new Logger(CacheCleanerController.name);
  constructor(private readonly service: CacheCleanerService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    this.logger.debug('Called every 10 seconds');
    // this.service.cleanCache();
  }
}
