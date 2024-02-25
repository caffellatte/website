import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@server/users/user.entity';
import { AuthService } from '@server/auth/auth.service';
import { UsersModule } from '@server/users/users.module';
import { UsersService } from '@server/users/users.service';

@Module({
  imports: [ConfigModule, UsersModule, TypeOrmModule.forFeature([User])],
  providers: [AuthService, UsersService],
  exports: [AuthService],
})
export class AuthModule {}
