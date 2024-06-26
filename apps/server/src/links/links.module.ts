import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksService } from '../links/links.service';
import { Link } from '../links/link.entity';
import { LinksProcessor } from '../links/links.processor';
import { BullModule } from '@nestjs/bullmq';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { TrpcService } from '../trpc/trpc.service';
import { User } from '../users/user.entity';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'links',
    }),
    BullBoardModule.forFeature({
      name: 'links',
      adapter: BullAdapter,
    }),
    TypeOrmModule.forFeature([Link, User]),
  ],
  providers: [LinksService, LinksProcessor, TrpcService],
  exports: [BullModule],
})
export class LinksModule {}
