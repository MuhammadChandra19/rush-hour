import { Test, TestingModule } from '@nestjs/testing';
import { CacheCleanerService } from './cache_cleaner.service';

describe('CacheCleanerService', () => {
  let service: CacheCleanerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheCleanerService],
    }).compile();

    service = module.get<CacheCleanerService>(CacheCleanerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
