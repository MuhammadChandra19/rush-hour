import { Controller, Logger } from '@nestjs/common';
import { GameCronService } from './game_cron.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('game-cron')
export class GameCronController {
  private readonly logger = new Logger(GameCronController.name);
  constructor(private readonly service: GameCronService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    this.logger.log('starting delete cache');
    // this.service.cleanCache();
    this.service.cleanGameCache().catch((e) => this.logger.log(e));
  }
}
