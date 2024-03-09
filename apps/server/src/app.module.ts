import { FastifyAdapter } from '@bull-board/fastify';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from '@server/app.controller';
import { AppService } from '@server/app.service';
import configuration from '@server/config/configuration';
import { Link } from '@server/links/link.entity';
import { TrpcModule } from '@server/trpc/trpc.module';
import { User } from '@server/users/user.entity';
import { Collection } from './collections/collection.entity';
import { CollectionsModule } from './collections/collections.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      load: [configuration],
    }),
    TrpcModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'pguser',
      password: 'password',
      database: 'db',
      entities: [User, Link, Collection],
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
    }),
    CollectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
