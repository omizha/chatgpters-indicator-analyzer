import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { SummarizeService } from './summarize.service';

@Controller('summarize')
export class SummarizeController {
  constructor(private readonly service: SummarizeService) {}

  @Get()
  getHello(@Query('url') url: string): Promise<any> {
    if (!url) throw new BadRequestException('url is required');
    return this.service.scrapper(url);
  }
}
