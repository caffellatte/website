import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { Collection } from '../collections/collection.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([User, Collection])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
