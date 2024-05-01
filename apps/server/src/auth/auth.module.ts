import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@server/users/user.entity';
import { Collection } from '@server/collections/collection.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '@server/auth/auth.service';
import { UsersModule } from '@server/users/users.module';
import { UsersService } from '@server/users/users.service';
import jwtConfig from '@server/config/jwt.config';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    UsersModule,
    TypeOrmModule.forFeature([User, Collection]),
  ],
  providers: [AuthService, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
