import { Module } from '@nestjs/common';
import { TrpcService } from '@broker/trpc/trpc.service';
import { TrpcRouter } from '@broker/trpc/trpc.router';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'links',
    }),
  ],
  providers: [TrpcService, TrpcRouter],
  exports: [BullModule],
})
export class TrpcModule {}
