import { Controller, HttpStatus, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './storage.config';
import { StorageService } from './storage.service';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async upload(@UploadedFile() file: Express.Multer.File, @Res() response) {
    try {
      await this.storageService.upload(file);
      return response.status(HttpStatus.OK).send('File uploaded successfully');
    }
    catch(error) {
      console.log(error)
      return response.status(HttpStatus.BAD_GATEWAY).send('Storage service unavailable');
    }
  }
}
