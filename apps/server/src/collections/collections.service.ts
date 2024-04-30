import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Collection } from '@server/collections/collection.entity';
import { Repository, TreeRepository } from 'typeorm';
import { User } from '@server/users/user.entity';
import { TRPCError } from '@trpc/server';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Collection)
    private collectionsRepository: TreeRepository<Collection>,
  ) {}

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
    const user = await this.usersRepository.findOneBy({ id: user_id });
    if (user) {
      const collections = await this.collectionsRepository
        .createQueryBuilder('collection')
        .innerJoin(
          'collection_closure',
          'cc',
          'cc.id_descendant = collection.id',
        )
        .where('collection.user_id = :user_id', { user_id: user_id })
        .getMany();
      console.log('collections:');
      console.log(collections);
      // const rootCategories = await this.collectionsRepository.findRoots();
      // console.log(rootCategories);
      // return rootCategories;
      // returns root categories without sub categories inside
      const c1 = new Collection();
      c1.parent = collections[0];
      c1.title = title;
      c1.description = description;
      c1.user = user;
      return await this.collectionsRepository.save(c1);
    } else {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
  }
}
