import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksService } from '@server/links/links.service';
import { Link } from '@server/links/link.entity';
import { LinksProcessor } from '@server/links/links.processor';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'links',
    }),
    TypeOrmModule.forFeature([Link]),
  ],
  providers: [LinksService, LinksProcessor],
  exports: [BullModule],
})
export class LinksModule {}
