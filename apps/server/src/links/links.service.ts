import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '@server/links/link.entity';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { User } from '@server/users/user.entity';
import { TRPCError } from '@trpc/server';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private linksRepository: Repository<Link>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectQueue('links') private readonly linksQueue: Queue,
  ) {}

  findAll(): Promise<Link[]> {
    return this.linksRepository.find();
  }

  async get(
    id: number,
    cursor: number,
    limit: number,
  ): Promise<{ data: Link[]; total: number }> {
    const [result, total] = await this.linksRepository
      .createQueryBuilder('link')
      .where('user_id = :user_id', { user_id: id })
      .select()
      .orderBy('id', 'DESC')
      .take(limit)
      .skip(cursor)
      .getManyAndCount();
    return {
      data: result,
      total: total,
    };
  }

  findOne(id: number): Promise<Link | null> {
    return this.linksRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.linksRepository.delete(id);
  }

  async create(
    user_id: number,
    title: string,
    description: string,
    url: string,
  ): Promise<Link> {
    const user = await this.usersRepository.findOneBy({ id: user_id });
    if (user) {
      const entity = this.linksRepository.create({
        title: title,
        description: description,
        url: url,
      });
      entity.user = user;
      return this.linksRepository.save(entity);
    } else {
      throw new TRPCError({ code: 'NOT_FOUND' });
    }
  }

  async analyze(
    user_id: number,
    id: number,
    type: string,
  ): Promise<{ status: string }> {
    await this.linksQueue.add('analyze', { user_id, id, type });
    // TODO: return JobID
    return { status: 'start' };
  }

  async metadata(url: string): Promise<{ data: any }> {
    const job = await this.linksQueue.add('metadata', { url });
    // TODO: return JobID
    return { data: job };
  }
}
