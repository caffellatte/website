import * as bcrypt from 'bcrypt';
import { TRPCError } from '@trpc/server';
import { Logger, Injectable } from '@nestjs/common';
import { UsersService } from '@server/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  private readonly logger = new Logger(AuthService.name);

  async signIn(username: string, pass: string): Promise<any> {
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
    const { password, ...result } = user;
    this.logger.debug(password);
    return result;
  }
}
