import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Collection } from '../collections/collection.entity';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import jwtConfig from '../config/jwt.config';

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
