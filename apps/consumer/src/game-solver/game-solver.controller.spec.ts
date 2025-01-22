import { Test, TestingModule } from '@nestjs/testing';
import { GameSolverController } from './game-solver.controller';

describe('GameSolverController', () => {
  let controller: GameSolverController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameSolverController],
    }).compile();

    controller = module.get<GameSolverController>(GameSolverController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
