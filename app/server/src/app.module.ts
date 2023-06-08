import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummarizeModule } from './summarize/summarize.module';

@Module({
  controllers: [AppController],
  imports: [MulterModule.register(), SummarizeModule],
  providers: [AppService],
})
export class AppModule {}
