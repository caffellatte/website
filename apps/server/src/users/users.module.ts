import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Collection } from '../collections/collection.entity';
import { ConfigModule } from '@nestjs/config';
import { UtilsService } from '@server/utils/utils.service';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User, Collection])],
  providers: [UsersService, UtilsService],
  exports: [UsersService],
})
export class UsersModule {}
