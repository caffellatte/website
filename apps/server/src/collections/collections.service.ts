import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from '@server/collections/collection.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionsRepository: Repository<Collection>,
  ) {}

  findOne(id: number): Promise<Collection | null> {
    return this.collectionsRepository.findOneBy({ id });
  }
}
