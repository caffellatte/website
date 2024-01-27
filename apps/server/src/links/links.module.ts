import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksService } from '@server/links/links.service';
import { Link } from '@server/links/link.entity';
import { LinksProcessor } from '@server/links/links.processor';
import { BullModule } from '@nestjs/bull';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { TrpcRouter } from '@server/trpc/trpc.router';
import { TrpcService } from '@server/trpc/trpc.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'links',
    }),
    BullBoardModule.forFeature({
      name: 'links',
      adapter: BullAdapter,
    }),
    TypeOrmModule.forFeature([Link]),
  ],
  providers: [LinksService, LinksProcessor, TrpcRouter, TrpcService],
  exports: [BullModule],
})
export class LinksModule {}
