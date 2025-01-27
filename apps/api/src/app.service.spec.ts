/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';
import { IGameRepository } from '@rush-hour/cache/dist';
import { IBoardRepository } from '@rush-hour/repo/dist';
import { BoardBody } from '@rush-hour/types/board';
import { Board } from '@rush-hour/repo/dist';

describe('AppService', () => {
  let appService: AppService;
  let gameRepositoryMock: jest.Mocked<IGameRepository>;
  let boardRepositoryMock: jest.Mocked<IBoardRepository>;
  let gameSolverClientMock: jest.Mocked<ClientKafka>;

  beforeEach(async () => {
    gameRepositoryMock = {
      getGame: jest.fn(),
      addOrUpdateGame: jest.fn(),
    } as unknown as jest.Mocked<IGameRepository>;

    boardRepositoryMock = {
      insertOne: jest.fn(),
      findOne: jest.fn(),
    } as unknown as jest.Mocked<IBoardRepository>;

    gameSolverClientMock = {
      emit: jest.fn(),
    } as unknown as jest.Mocked<ClientKafka>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        { provide: 'GAME_SOLVER', useValue: gameSolverClientMock },
        { provide: IGameRepository, useValue: gameRepositoryMock },
        { provide: IBoardRepository, useValue: boardRepositoryMock },
      ],
    }).compile();

    appService = module.get<AppService>(AppService);
  });

  describe('createBoard', () => {
    it('should create a board and return its ID', async () => {
      const boardRequest: BoardBody = {
        board: [
          [1, 2],
          [1, 2],
        ],
      };
      const mockBoard: Board = {
        board: boardRequest.board,
        createdAt: new Date(),
        isSolved: false,
      };
      const mockInsertResult = { _id: { toHexString: () => '123' } };

      boardRepositoryMock.insertOne.mockResolvedValue(
        mockInsertResult as Board,
      );

      const result = await appService.createBoard(boardRequest);

      expect(result).toEqual('123');
      expect(boardRepositoryMock.insertOne).toHaveBeenCalledWith(mockBoard);
    });
  });

  describe('getGame', () => {
    it('should return game details if game exists', async () => {
      const timenow = new Date();
      gameRepositoryMock.getGame.mockResolvedValue({
        id: 'game-123',
        boardID: 'board-1',
        board: {
          board: [
            [1, 2],
            [1, 2],
          ],
        },
        moveType: 'Good',
        steps: [],
        isSolved: false,
        updatedAt: timenow,
      });

      const result = await appService.getGame('game-123');

      expect(result).toEqual({
        id: 'game-123',
        boardID: 'board-1',
        board: {
          board: [
            [1, 2],
            [1, 2],
          ],
        },
        moveType: 'Good',
        steps: [],
        isSolved: false,
        updatedAt: timenow,
      });
      expect(gameRepositoryMock.getGame).toHaveBeenCalledWith('game-123');
    });

    it('should return undefined if game does not exist', async () => {
      gameRepositoryMock.getGame.mockResolvedValue(null);

      const result = await appService.getGame('game-123');

      expect(result).toBeNull();
      expect(gameRepositoryMock.getGame).toHaveBeenCalledWith('game-123');
    });
  });

  describe('startGame', () => {
    it('should start a game and return game ID if board exists', async () => {
      const mockBoard = {
        board: [
          [1, 2],
          [1, 2],
        ],
        createdAt: new Date(),
        isSolved: false,
      };

      boardRepositoryMock.findOne.mockResolvedValue(mockBoard);
      gameRepositoryMock.addOrUpdateGame.mockResolvedValue(undefined);

      const result = await appService.startGame('board-1');

      expect(result?.gameID).toEqual('board-1-game');
      expect(boardRepositoryMock.findOne).toHaveBeenCalledWith('board-1');
      expect(gameRepositoryMock.addOrUpdateGame).toHaveBeenCalledWith(
        expect.objectContaining({
          boardID: 'board-1',
          board: mockBoard,
          id: 'board-1-game',
        }),
      );
    });

    it('should return an empty string if board does not exist', async () => {
      boardRepositoryMock.findOne.mockResolvedValue(null);

      const result = await appService.startGame('board-1');

      expect(result).toEqual({});
      expect(boardRepositoryMock.findOne).toHaveBeenCalledWith('board-1');
    });
  });

  describe('moveCar', () => {
    it('should emit a game move event if the game is not solved', async () => {
      const boardRequest: BoardBody = {
        board: [
          [1, 0],
          [1, 0],
        ],
      };

      gameRepositoryMock.getGame.mockResolvedValue({
        board: {
          board: [
            [1, 0],
            [1, 0],
          ],
        },
        boardID: 'board-1',
        id: '123',
        isSolved: false,
        moveType: 'Blunder',
        steps: [],
        updatedAt: new Date(),
      });

      const result = await appService.moveCar('game-123', boardRequest);

      expect(result).toBe(false);
      expect(gameSolverClientMock.emit).toHaveBeenCalledWith(
        'game.move',
        JSON.stringify({ board: boardRequest, gameID: 'game-123' }),
      );
    });

    it('should not emit a game move event if the game is solved', async () => {
      const boardRequest: BoardBody = {
        board: [
          [1, 0],
          [1, 0],
        ],
      };

      gameRepositoryMock.getGame.mockResolvedValue({
        board: {
          board: [
            [1, 0],
            [1, 0],
          ],
        },
        boardID: 'board-1',
        id: '123',
        isSolved: true,
        moveType: 'Blunder',
        steps: [],
        updatedAt: new Date(),
      });

      const result = await appService.moveCar('game-123', boardRequest);

      expect(result).toBe(true);
      expect(gameSolverClientMock.emit).not.toHaveBeenCalled();
    });
  });
});
