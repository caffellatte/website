import { Module } from '@nestjs/common';
import { TrpcService } from '../trpc/trpc.service';
import { TrpcRouter } from '../trpc/trpc.router';
import { LinksService } from '../links/links.service';
import { LinksModule } from '../links/links.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '../links/link.entity';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { AuthModule } from '../auth/auth.module';
import { CollectionsModule } from '../collections/collections.module';
import { ConfigModule } from '@nestjs/config';
import { Collection } from '../collections/collection.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Link, User, Collection]),
    LinksModule,
    UsersModule,
    AuthModule,
    CollectionsModule,
  ],
  controllers: [],
  providers: [TrpcRouter, TrpcService, LinksService, UsersService],
})
export class TrpcModule {}
