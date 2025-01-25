import { Injectable, Logger } from '@nestjs/common';
import { IGameRepository } from '@rush-hour/cache/dist';

@Injectable()
export class GameCronService {
  private readonly logger = new Logger(GameCronService.name);
  constructor(private readonly gameRepo: IGameRepository) {}

  async cleanGameCache() {
    try {
      await this.gameRepo.removeStaleGames();
    } catch (e) {
      this.logger.error(e);
    }
  }
}
