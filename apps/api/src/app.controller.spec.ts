/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateBoardRequest } from './dto/board';
import { UpdateGameRequest } from './dto/game';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            createBoard: jest.fn(),
            getGame: jest.fn(),
            startGame: jest.fn(),
            moveCar: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('createGame', () => {
    it('should return board response with ID', async () => {
      const boardRequest: CreateBoardRequest = {
        board: [
          [1, 2],
          [1, 2],
        ],
      };

      jest.spyOn(appService, 'createBoard').mockResolvedValue('123');

      const result = await appController.createGame(boardRequest);

      expect(result).toEqual({
        id: '123',
        board: [
          [1, 2],
          [1, 2],
        ],
      });
      expect(appService.createBoard).toHaveBeenCalledWith(boardRequest);
    });
  });

  describe('getGame', () => {
    it('should return game details when game exists', async () => {
      jest.spyOn(appService, 'getGame').mockResolvedValue({
        id: '123',
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
        updatedAt: new Date(),
      });

      const result = await appController.getGame('123');

      expect(result).toEqual({
        id: '123',
        boardID: 'board-1',
        board: [
          [1, 2],
          [1, 2],
        ],
        state: 'Good',
      });
      expect(appService.getGame).toHaveBeenCalledWith('123');
    });

    it('should return default response when game does not exist', async () => {
      jest.spyOn(appService, 'getGame').mockResolvedValue(null);

      const result = await appController.getGame('123');

      expect(result).toEqual({
        id: '',
        board: [],
        boardID: '',
        state: 'Unknown',
      });
      expect(appService.getGame).toHaveBeenCalledWith('123');
    });
  });

  describe('startGame', () => {
    it('should return game ID when game starts successfully', async () => {
      jest
        .spyOn(appService, 'startGame')
        .mockResolvedValue({ board: [[1], [1]], gameID: 'game-123' });

      const result = await appController.startGame('board-1');

      expect(result.id).toEqual('game-123');
      expect(appService.startGame).toHaveBeenCalledWith('board-1');
    });

    it('should return error message when board is not found', async () => {
      jest.spyOn(appService, 'startGame').mockResolvedValue({});

      const result = await appController.startGame('board-1');

      expect(result).toEqual({});
      expect(appService.startGame).toHaveBeenCalledWith('board-1');
    });
  });

  describe('moveCar', () => {
    it('should return true when car move is solved', async () => {
      const updateRequest: UpdateGameRequest = {
        board: [
          [1, 0],
          [1, 0],
        ],
      };

      jest.spyOn(appService, 'moveCar').mockResolvedValue(true);

      const result = await appController.moveCar('game-123', updateRequest);

      expect(result).toBe(true);
      expect(appService.moveCar).toHaveBeenCalledWith('game-123', {
        board: [
          [1, 0],
          [1, 0],
        ],
      });
    });

    it('should return false when car move is not solved', async () => {
      const updateRequest: UpdateGameRequest = {
        board: [
          [1, 0],
          [1, 0],
        ],
      };

      jest.spyOn(appService, 'moveCar').mockResolvedValue(false);

      const result = await appController.moveCar('game-123', updateRequest);

      expect(result).toBe(false);
      expect(appService.moveCar).toHaveBeenCalledWith('game-123', {
        board: [
          [1, 0],
          [1, 0],
        ],
      });
    });
  });
});
