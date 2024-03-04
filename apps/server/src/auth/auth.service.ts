import * as bcrypt from 'bcrypt';
import { TRPCError } from '@trpc/server';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger, Injectable } from '@nestjs/common';
import { UsersService } from '@server/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  private readonly logger = new Logger(AuthService.name);
  refreshSecret = this.configService.get<string>('jwt.refreshSecret');
  refreshExpiresIn = this.configService.get<string>(
    'jwt.refreshSignOptions.expiresIn',
  );

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: `User with username ${username} not found.`,
      });
    }

    const isMatch = await bcrypt.compare(pass, user?.password);

    if (!isMatch) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Incorrect password. Please try again.',
      });
    }
    const payload = { sub: user.id, username: user.username };
    return {
      access_token: await this.jwtService.signAsync(payload),
      refresh_token: await this.jwtService.signAsync(payload, {
        secret: this.refreshSecret,
        expiresIn: this.refreshExpiresIn,
      }),
    };
  }

  async refresh(
    refresh_token: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload = await this.jwtService.verifyAsync(refresh_token, {
      secret: this.refreshSecret,
    });
    /**
     * Error Handling
     */
    return {
      access_token: await this.jwtService.signAsync({
        sub: payload.sub,
        username: payload.username,
      }),
      refresh_token: await this.jwtService.signAsync(
        { sub: payload.sub, username: payload.username },
        {
          secret: this.refreshSecret,
          expiresIn: this.refreshExpiresIn,
        },
      ),
    };
  }
}
