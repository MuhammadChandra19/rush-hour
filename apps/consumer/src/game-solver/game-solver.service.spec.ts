import { Test, TestingModule } from '@nestjs/testing';
import { GameSolverService } from './game-solver.service';

describe('GameSolverService', () => {
  let service: GameSolverService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameSolverService],
    }).compile();

    service = module.get<GameSolverService>(GameSolverService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
