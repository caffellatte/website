import { Module } from '@nestjs/common';
import { CollectionsService } from '../collections/collections.service';
import { Collection } from '../collections/collection.entity';
import { User } from '../users/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UtilsService } from '@server/utils/utils.service';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, User])],
  providers: [CollectionsService, UtilsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
