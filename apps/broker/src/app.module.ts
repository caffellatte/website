import { Module } from '@nestjs/common';
import { AppService } from '@broker/app.service';
import { TrpcModule } from '@broker/trpc/trpc.module';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        password: 'password',
        port: 6379,
      },
    }),
    TrpcModule,
  ],
  providers: [AppService],
})
export class AppModule {}
