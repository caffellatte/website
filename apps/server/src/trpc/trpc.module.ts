import { Module } from '@nestjs/common';
import { TrpcService } from '@server/trpc/trpc.service';
import { TrpcRouter } from '@server/trpc/trpc.router';
import { LinksService } from '@server/links/links.service';
import { LinksModule } from '@server/links/links.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '@server/links/link.entity';
import { User } from '@server/users/user.entity';
import { UsersModule } from '@server/users/users.module';
import { UsersService } from '@server/users/users.service';
import { AuthModule } from '@server/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Link, User]),
    LinksModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [TrpcRouter, TrpcService, LinksService, UsersService],
})
export class TrpcModule {}
