import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LinksService } from '@server/links/links.service';
import { LinksController } from '@server/links/links.controller';
import { Link } from '@server/links/link.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Link])],
  providers: [LinksService],
  controllers: [LinksController],
})
export class LinksModule {}
