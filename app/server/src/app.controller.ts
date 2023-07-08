import { Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppService, CsvData } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): CsvData[] {
    return this.appService.extractData();
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
          const targetDate = '2023.4.2';
          const [year, month, day] = targetDate.split('.').map(Number);
          const filename = `${year}${month}${day}.${
            file.originalname.split('.')[file.originalname.split('.').length - 1]
          }`;
          cb(null, filename);
        },
      }),
    }),
  )
  uploadCsv(@UploadedFile() file: Express.Multer.File): Express.Multer.File {
    return file;
  }
}
