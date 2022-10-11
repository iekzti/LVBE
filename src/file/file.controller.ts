import { FileService } from './file.service';
import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger/dist/decorators';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';

import { JwtGuard } from 'src/auth/guard';
import { editFileName } from 'src/utils/string';
import UploadFileDto from './dto/upload-file.dto';
import { GetUser } from 'src/auth/decorator';
import { createReadStream } from 'fs';
import { join } from 'path';
import GetFileDto from './dto/get-file.dto';
import { Response } from 'express';

@ApiTags('File')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}


  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV file',
    type: UploadFileDto,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
    }),
  )
  uploadFile(
    @GetUser('sub') userId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UploadFileDto,
  ) {
    return this.fileService.uploadFile(userId, dto, file.path, file.filename)
  }

  @Post('get-file')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="package.json"')
  getFile(@Body() dto: GetFileDto, @Res() res: Response) {
    res.setHeader('Content-disposition', 'attachment; filename=' + dto.fileName);
    const filestream = createReadStream(dto.path);
    filestream.pipe(res);
  }
}
