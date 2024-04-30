import { Module } from '@nestjs/common';
import { CollectionsService } from '@server/collections/collections.service';
import { Collection } from '@server/collections/collection.entity';
import { User } from '@server/users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, User])],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
