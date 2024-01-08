import { Module } from '@nestjs/common';
import { AppController } from '@server/app.controller';
import { AppService } from '@server/app.service';
import { TrpcModule } from '@server/trpc/trpc.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { User } from '@server/users/user.entity';
import { Link } from '@server/links/link.entity';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
