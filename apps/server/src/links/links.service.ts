import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '@server/links/link.entity';

@Injectable()
export class LinksService {
  constructor(
    @InjectRepository(Link)
    private linksRepository: Repository<Link>,
  ) {}

  findAll(): Promise<Link[]> {
    return this.linksRepository.find();
  }

  findOne(id: number): Promise<Link | null> {
    return this.linksRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.linksRepository.delete(id);
  }

  async create(title: string, description: string, url: string): Promise<Link> {
    const entity = this.linksRepository.create({
      title: title,
      description: description,
      url: url,
    });
    return this.linksRepository.save(entity);
  }
}
