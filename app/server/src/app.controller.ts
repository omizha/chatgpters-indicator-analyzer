import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/csv')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './public/csv/',
      storage: diskStorage({
        destination(req, file, cb) {
          cb(null, './public/csv/');
        },
        filename: (req, file, cb) => {
          cb(null, `${new Date().getTime()}.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`);
        },
      }),
    }),
  )
  uploadCsv(@UploadedFile() file: Express.Multer.File): Express.Multer.File {
    return file;
  }
}
