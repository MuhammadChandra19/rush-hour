import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '../service';
import { Game, MoveType } from '@rush-hour/types/game';
import { GameRepository } from './repository';

describe('GameRepository', () => {
  let repository: GameRepository;
  let cacheService: CacheService;
  let mockRedisClient: any;

  const mockGame: Game = {
    id: 'game-123',
    boardID: 'board-456',
    board: { board: [] },
    moveType: 'Good',
    steps: [],
    isSolved: false,
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockRedisClient = {
      hSet: jest.fn(),
      zAdd: jest.fn(),
      hGetAll: jest.fn(),
      zRangeByScore: jest.fn(),
      del: jest.fn(),
      zRem: jest.fn(),
    };

    const mockCacheService = {
      getClient: jest.fn().mockReturnValue(mockRedisClient),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [GameRepository, { provide: CacheService, useValue: mockCacheService }],
    }).compile();

    repository = module.get<GameRepository>(GameRepository);
    cacheService = module.get<CacheService>(CacheService);
  });

  describe('addOrUpdateGame', () => {
    it('should add or update a game in Redis', async () => {
      await repository.addOrUpdateGame(mockGame);

      expect(mockRedisClient.hSet).toHaveBeenCalledWith(
        `games:${mockGame.id}`,
        expect.objectContaining({
          id: mockGame.id,
          boardID: mockGame.boardID,
          board: JSON.stringify(mockGame.board),
          state: mockGame.moveType,
          isSolved: `${mockGame.isSolved}`,
          steps: JSON.stringify(mockGame.steps),
          updatedAt: expect.any(String),
        })
      );

      expect(mockRedisClient.zAdd).toHaveBeenCalledWith('games_updated_at', {
        value: mockGame.id,
        score: expect.any(Number),
      });
    });
  });

  describe('removeStaleGames', () => {
    it('should remove stale games from Redis', async () => {
      const now = Date.now();
      const expiryThreshold = now - 300 * 1000; // 5 minutes
      const staleGames = ['game-1', 'game-2'];

      mockRedisClient.zRangeByScore.mockResolvedValue(staleGames);

      await repository.removeStaleGames();

      expect(mockRedisClient.zRangeByScore).toHaveBeenCalledWith('games_updated_at', 0, expiryThreshold);

      for (const gameId of staleGames) {
        expect(mockRedisClient.del).toHaveBeenCalledWith(`games:${gameId}`);
        expect(mockRedisClient.zRem).toHaveBeenCalledWith('games_updated_at', gameId);
      }
    });
  });

  describe('getGame', () => {
    it('should return a game if it exists in Redis', async () => {
      mockRedisClient.hGetAll.mockResolvedValue({
        id: mockGame.id,
        boardID: mockGame.boardID,
        board: JSON.stringify(mockGame.board),
        state: mockGame.moveType,
        isSolved: `${mockGame.isSolved}`,
        steps: JSON.stringify(mockGame.steps),
        updatedAt: mockGame.updatedAt.toISOString(),
      });

      const result = await repository.getGame(mockGame.id);

      expect(result).toEqual({
        id: mockGame.id,
        boardID: mockGame.boardID,
        board: mockGame.board,
        moveType: mockGame.moveType,
        steps: mockGame.steps,
        isSolved: mockGame.isSolved,
        updatedAt: expect.any(Date),
      });

      expect(mockRedisClient.hGetAll).toHaveBeenCalledWith(`games:${mockGame.id}`);
    });

    it('should return null if the game does not exist', async () => {
      mockRedisClient.hGetAll.mockResolvedValue({});

      const result = await repository.getGame('non-existent-game');

      expect(result).toBeNull();
      expect(mockRedisClient.hGetAll).toHaveBeenCalledWith('games:non-existent-game');
    });
  });
});
