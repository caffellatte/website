import { Module } from '@nestjs/common';
import { TrpcService } from '@server/trpc/trpc.service';
import { TrpcRouter } from '@server/trpc/trpc.router';
import { LinksService } from '@server/links/links.service';
import { LinksModule } from '@server/links/links.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Link } from '@server/links/link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Link]), LinksModule],
  controllers: [],
  providers: [TrpcService, TrpcRouter, LinksService],
})
export class TrpcModule {}
