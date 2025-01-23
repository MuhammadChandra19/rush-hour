import { Game } from '@rush-hour/types/game';

export abstract class IGameRepository {
  abstract addOrUpdateGame(game: Game): Promise<void>;
  abstract removeStaleGames(): Promise<void>;
  abstract getGame(id: string): Promise<Game | null>;
}
