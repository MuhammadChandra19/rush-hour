import { Test, TestingModule } from '@nestjs/testing';
import { CacheCleanerController } from './cache_cleaner.controller';

describe('CacheCleanerController', () => {
  let controller: CacheCleanerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CacheCleanerController],
    }).compile();

    controller = module.get<CacheCleanerController>(CacheCleanerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
