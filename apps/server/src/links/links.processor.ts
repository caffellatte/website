import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '@server/links/link.entity';
import { TrpcService } from '@server/trpc/trpc.service';

@Processor('links')
export class LinksProcessor {
  constructor(
    @InjectRepository(Link)
    private linksRepository: Repository<Link>,
    private readonly trpcService: TrpcService,
  ) {}
  private readonly logger = new Logger(LinksProcessor.name);

  @Process('analyze')
  async handleAnalyze(job: Job) {
    this.logger.debug('Start Analyze...');
    this.logger.debug(job.data);
    const links = await this.linksRepository.find();
    this.trpcService.ee.emit('update', { type: 'reports' });
    this.logger.debug(links);
    this.logger.debug('FindOne Analyze');
  }
}
