import { Injectable, Logger } from '@nestjs/common';
import { IGameRepository } from './interface';
import { CacheService } from 'src/service';
import { Game, GameState } from '@rush-hour/types/game';

// Constants
const GAME_HASH_KEY = 'games'; // Key to store game hashes
const GAME_ZSET_KEY = 'games_updated_at'; // Key for sorted set
const GAME_EXPIRY_TIME = 300; // 5 minutes in seconds

@Injectable()
export class GameRepository implements IGameRepository {
  private readonly logger = new Logger(GameRepository.name);

  constructor(private readonly cacheService: CacheService) {}

  private get client() {
    return this.cacheService.getClient();
  }

  async addOrUpdateGame(game: Game): Promise<void> {
    const gameKey = `${GAME_HASH_KEY}:${game.id}`;

    await this.client.hSet(gameKey, {
      id: game.id,
      boardID: game.boardID,
      board: JSON.stringify(game.board),
      state: game.state,
      steps: JSON.stringify(game.steps),
      updatedAt: game.updatedAt.toISOString(),
    });

    await this.client.zAdd(GAME_ZSET_KEY, {
      value: game.id,
      score: game.updatedAt.getTime(),
    });
  }

  async removeStaleGames(): Promise<void> {
    const now = Date.now();
    const expiryThreshold = now - GAME_EXPIRY_TIME * 1000;

    // Get games older than the threshold
    const staleGames = await this.client.zRangeByScore(GAME_ZSET_KEY, 0, expiryThreshold);
    for (const gameId of staleGames) {
      // Delete the game from both hash and sorted set
      await this.client.del(`${GAME_HASH_KEY}:${gameId}`);
      await this.client.zRem(GAME_ZSET_KEY, gameId);
      this.logger.log(`Deleted stale game: ${gameId}`);
    }
  }

  async getGame(gameId: string): Promise<Game | null> {
    const gameKey = `${GAME_HASH_KEY}:${gameId}`;
    const gameData = await this.client.hGetAll(gameKey);

    if (Object.keys(gameData).length === 0) {
      // Game not found
      return null;
    }

    // Convert the Redis hash back into a Game object
    const game: Game = {
      id: gameData.id,
      boardID: gameData.boardID,
      board: JSON.parse(gameData.board),
      state: gameData.state as GameState,
      steps: JSON.parse(gameData.steps),
      updatedAt: new Date(gameData.updatedAt),
    };

    return game;
  }
}
