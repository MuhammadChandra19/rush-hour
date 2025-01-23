import { Test, TestingModule } from '@nestjs/testing';
import { GameCronController } from './game_cron.controller';

describe('GameCronController', () => {
  let controller: GameCronController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameCronController],
    }).compile();

    controller = module.get<GameCronController>(GameCronController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
