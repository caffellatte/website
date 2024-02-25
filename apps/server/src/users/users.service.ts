import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

interface AuthVariables {
  salt: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
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
    const hash = await bcrypt.hash(password, this.salt);
    const entity = this.usersRepository.create({
      username: username,
      password: hash,
    });
    return this.usersRepository.save(entity);
  }
}
