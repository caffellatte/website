import { Module } from '@nestjs/common';
import { AppController } from '@server/app.controller';
import { AppService } from '@server/app.service';
import { TrpcModule } from '@server/trpc/trpc.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { User } from '@server/users/user.entity';
import { Link } from '@server/links/link.entity';
import { BullBoardModule } from '@bull-board/nestjs';
import { FastifyAdapter } from '@bull-board/fastify';
// import { BasicAuthMiddleware } from './utils/basic-auth.middleware';

@Module({
  imports: [
    TrpcModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pguser',
      password: 'password',
      database: 'db',
      entities: [User, Link],
      synchronize: true, // shouldn't be used in production
      logging: true,
      autoLoadEntities: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        password: 'password',
        port: 6379,
      },
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: FastifyAdapter,
      // middleware: BasicAuthMiddleware,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
