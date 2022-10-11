import { Injectable, NotFoundException } from '@nestjs/common';
import { File } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import UploadFileDto from './dto/upload-file.dto';

@Injectable()
export class FileService {
  constructor(private prisma: PrismaService) {}

  async uploadFile(
    userId: number,
    dto: UploadFileDto,
    filePath: string,
    fileName: string,
  ): Promise<File> {
    const fileType = await this.prisma.fileType.findFirst({
      where: { name: dto.type },
    });
    if (!fileType) throw new NotFoundException('Not found type');

    return this.prisma.file.create({
      data: {
        name: dto.name,
        fileName: fileName,
        fileTypeId: fileType.id,
        userId,
        url: filePath,
      },
    });
  }
}
