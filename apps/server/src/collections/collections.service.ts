import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from '../collections/collection.entity';
import { Repository, TreeRepository } from 'typeorm';
import { User } from '../users/user.entity';
import { TRPCError } from '@trpc/server';
import { UtilsService } from '@server/utils/utils.service';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Collection)
    private collectionsRepository: TreeRepository<Collection>,
    private readonly utilsService: UtilsService,
  ) {}

  /**
   * Redact password from User entity
   */

  findOne(id: number): Promise<Collection | null> {
    return this.collectionsRepository.findOneBy({ id });
  }

  async create(
    user_id: number,
    title: string,
    description: string,
    path: string,
  ) {
    console.log('CollectionsService:');
    console.log(user_id, title, description, path);
    const user = await this.usersRepository.findOne({
      where: { id: user_id },
      relations: ['collections'],
    });
    if (user) {
      const newCollection = new Collection();
      newCollection.title = title;
      newCollection.description = description;
      newCollection.user = this.utilsService.redact(user);
      newCollection.parent = user.collections[0];
      return await this.collectionsRepository.save(newCollection);
    } else {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
  }

  async findTrees(user_id: number) {
    const user = await this.usersRepository.findOne({
      where: { id: user_id },
      relations: ['collections'],
    });
    if (user) {
      const childrenTree = await this.collectionsRepository.findDescendantsTree(
        user.collections[0],
      );
      return childrenTree;
    } else {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
  }
}
