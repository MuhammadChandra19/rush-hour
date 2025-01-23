import { Controller, Logger } from '@nestjs/common';
import { GameCronService } from './game_cron.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('game-cron')
export class GameCronController {
  private readonly logger = new Logger(GameCronController.name);
  constructor(private readonly service: GameCronService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleCron() {
    console.log('Called every 10 seconds');
    this.logger.log('Called every 10 seconds');
    // this.service.cleanCache();
  }
}
