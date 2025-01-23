import { Injectable } from '@nestjs/common';
import { MongoService } from 'src/app.service';
import { BaseRepository } from 'src/utils/base.repository';
import { Board } from 'src/entity/board';

@Injectable()
export class BoardRepository extends BaseRepository<Board> {
  protected collectionName = 'boards';

  constructor(mongoService: MongoService) {
    super(mongoService);
  }
}
