import { Module } from '@nestjs/common';
import { CollectionsService } from '@server/collections/collections.service';
import { Collection } from '@server/collections/collection.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Collection])],
  providers: [CollectionsService],
})
export class CollectionsModule {}
