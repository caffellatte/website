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
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([Link, User]),
    BullModule.registerQueue({
      name: 'links',
    }),
    LinksModule,
    UsersModule,
  ],
  controllers: [],
  providers: [TrpcService, TrpcRouter, LinksService, UsersService],
  exports: [BullModule],
})
export class TrpcModule {}
