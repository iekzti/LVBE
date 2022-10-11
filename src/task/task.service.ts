import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import UpdateUserDto from 'src/user/dto/update-user.dto';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  createTask(name: string, time?: number) {
    return this.prisma.task.create({
      data: {
        name,
        time,
      },
    });
  }

  updateTask(dto: UpdateUserDto) {
  }
}
