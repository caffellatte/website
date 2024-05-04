import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Link } from '../links/link.entity';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import urlMetadata = require('url-metadata');

@Processor('links')
export class LinksProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Link)
    private linksRepository: Repository<Link>,
  ) {
    super();
  }
  private readonly logger = new Logger(LinksProcessor.name);

  // @Process('analyze')
  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    if (job.name === 'metadata') {
      console.log(job.data);
      let url = '';

      if (!/^https?:\/\//i.test(job.data.url)) {
        url = 'http://' + job.data.url;
      } else {
        url = job.data.url;
      }
      try {
        const metadata = await urlMetadata(url);
        console.log(metadata);
        job.data.data = metadata;
        return job.data;
      } catch (error) {
        job.data.data = error;
        return job.data;
      }
    }
    if (job.name === 'analyze') {
      this.logger.debug('Start Analyze...');
      this.logger.debug(job.data);
      this.logger.debug(token);
      const links = await this.linksRepository.find();
      this.logger.debug(links.length);
      this.logger.debug('End Analyze');
      return job.data;
    }
  }
}
