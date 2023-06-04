import { Module } from '@nestjs/common';
import { SummarizeController } from './summarize.controller';
import { SummarizeService } from './summarize.service';

@Module({
  controllers: [SummarizeController],
  providers: [SummarizeService],
})
export class SummarizeModule {}
