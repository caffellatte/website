import { Controller, Get, Post } from '@nestjs/common';

@Controller('links')
export class LinksController {
  @Post()
  create(): string {
    return 'This action adds a new link';
  }

  @Get()
  findAll(): string {
    return 'This action returns all links';
  }
}
