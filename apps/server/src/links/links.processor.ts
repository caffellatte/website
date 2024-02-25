import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '@server/links/link.entity';

@Processor('links')
export class LinksProcessor {
  constructor(
    @InjectRepository(Link)
    private linksRepository: Repository<Link>,
  ) {}
  private readonly logger = new Logger(LinksProcessor.name);

  @Process('analyze')
  async handleAnalyze(job: Job) {
    this.logger.debug('Start Analyze...');
    this.logger.debug(job.data);
    const links = await this.linksRepository.find();
    this.logger.debug(links.length);
    this.logger.debug('End Analyze');
    return job.data;
  }
}
