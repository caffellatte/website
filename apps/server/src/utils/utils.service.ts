import { Injectable } from '@nestjs/common';
import { User } from '../users/user.entity';

@Injectable()
export class UtilsService {
  public redact(user: Omit<User, 'password'>): Omit<User, 'password'> {
    const { id, username, links, collections } = user;
    return { id, username, links, collections };
  }
}

// function redact(user: User): Omit<User, 'password'> {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const { password, ...redactUser } = user;
//   return redactUser;
// }
