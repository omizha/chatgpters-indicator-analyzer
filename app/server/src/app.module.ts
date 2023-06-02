import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  controllers: [AppController],
  imports: [
    MulterModule.register({
      dest: './upload',
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
