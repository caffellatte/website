import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '@server/links/link.entity';
import { TrpcService } from '@server/trpc/trpc.service';
import { TrpcRouter } from '@server/trpc/trpc.router';

@Processor('links')
export class LinksProcessor {
  constructor(
    @InjectRepository(Link)
    private linksRepository: Repository<Link>,
    private readonly trpcRouter: TrpcRouter,
    private readonly trpcService: TrpcService,
  ) {}
  private readonly logger = new Logger(LinksProcessor.name);

  createCaller = this.trpcService.createCallerFactory(
    this.trpcRouter.appRouter,
  );

  @Process('analyze')
  async handleAnalyze(job: Job) {
    this.logger.debug('Start Analyze...');
    this.logger.debug(job.data);
    const caller = this.createCaller({ user: job.data.user }); // TODO: create global caller function
    const links = await this.linksRepository.find();
    caller.linkCreate({
      title: 'title server side created',
      description: 'description server side created',
      url: 'url server side created',
    });
    this.trpcService.ee.emit('update', { type: 'reports' });
    this.logger.debug(links);
    this.logger.debug('FindOne Analyze');
  }
}
