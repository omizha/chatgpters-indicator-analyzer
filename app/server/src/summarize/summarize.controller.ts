import { Controller, Get, Query } from '@nestjs/common';
import type { ChainValues } from 'langchain/dist/schema';
import { Document } from 'langchain/document';
import { SummarizeService } from './summarize.service';

@Controller('summarize')
export class SummarizeController {
  constructor(private readonly service: SummarizeService) {}

  @Get()
  async summarize(@Query('url') url: string): Promise<ChainValues> {
    const results = await this.service.summarizeUrl(url);
    return results;
  }

  @Get('scrapper')
  async scrapper(@Query('url') url: string): Promise<Document> {
    const results = await this.service.scrapper(url);
    return results[0];
  }
}
