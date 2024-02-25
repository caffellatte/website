import * as bcrypt from 'bcrypt';
import { UsersService } from '@server/users/users.service';
import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

interface AuthVariables {
  salt: number;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService<AuthVariables>,
  ) {}

  salt = this.configService.get<number>('salt', { infer: true });

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new NotFoundException();
    }
    const hash = await bcrypt.hash(pass, this.salt);
    const isMatch = await bcrypt.compare(user?.password, hash);
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const { password, ...result } = user;
    console.log(password);
    return result;
  }
}
