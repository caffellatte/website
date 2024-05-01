import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '@server/users/users.service';
import { User } from '@server/users/user.entity';
import { Collection } from '@server/collections/collection.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User, Collection])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
