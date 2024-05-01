import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, TreeRepository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Collection } from '@server/collections/collection.entity';

interface AuthVariables {
  salt: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Collection)
    private collectionsRepository: TreeRepository<Collection>,
    private configService: ConfigService<AuthVariables>,
  ) {}

  salt = this.configService.get<number>('salt', { infer: true });

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findOneByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ username });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async create(username: string, password: string): Promise<User> {
    function redact(user: User): Omit<User, 'password'> {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...redactUser } = user;
      return redactUser;
    }
    const hash = await bcrypt.hash(password, this.salt);
    const user = this.usersRepository.create({
      username: username,
      password: hash,
    });
    await this.usersRepository.save(user);
    const collection = new Collection();
    // TODO: create utils with redact method
    collection.user = redact(user);
    collection.title = username;
    collection.description = 'This is your root collection';
    await this.collectionsRepository.save(collection);
    return user;
  }
}
