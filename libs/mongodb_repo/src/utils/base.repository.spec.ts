import { Test, TestingModule } from '@nestjs/testing';
import { BaseRepository } from './base.repository';
import { Board } from 'src/entity/board';
import { MongoService } from 'src/app.service';
import { Collection } from 'mongodb';

class MongoServiceMock extends BaseRepository<Board> {
  protected collectionName: string;
  constructor(mongoService: MongoService) {
    super(mongoService);
  }
}

describe('BaseRepository', () => {
  let mockRepo: MongoServiceMock;
  let mongoService: jest.Mocked<MongoService>;

  const mockCollection = {
    find: jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([]), // Mock toArray
    }),
    findOne: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    // Mock the MongoService
    mongoService = {
      getCollection: jest.fn().mockReturnValue(mockCollection as unknown as Collection<Board>),
    } as unknown as jest.Mocked<MongoService>;

    // Initialize the mock repository
    mockRepo = new MongoServiceMock(mongoService);
  });

  describe('find', () => {
    it('should call find on the collection', async () => {
      const filter = { name: 'test' };

      const result = await mockRepo.find(filter);
      expect(mockCollection.find).toHaveBeenCalledWith(filter);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should call findOne on the collection', async () => {
      const filter = { name: 'test' };

      await mockRepo.findOne(filter);
      expect(mockCollection.findOne).toHaveBeenCalledWith(filter);
    });
  });

  describe('deleteOne', () => {
    it('should call deleteOne on the collection', async () => {
      const filter = { name: 'test' };

      await mockRepo.deleteOne(filter);
      expect(mockCollection.deleteOne).toHaveBeenCalledWith(filter);
    });
  });
});
