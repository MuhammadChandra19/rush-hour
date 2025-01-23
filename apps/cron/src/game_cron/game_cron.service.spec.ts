import { Test, TestingModule } from '@nestjs/testing';
import { GameCronService } from './game_cron.service';

describe('CacheCleanerService', () => {
  let service: GameCronService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameCronService],
    }).compile();

    service = module.get<GameCronService>(GameCronService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
