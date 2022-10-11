import { Injectable, Delete } from '@nestjs/common';
import { ClassificationRule } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateClassificationRule from './dto/create-classification-rule.dto';

@Injectable()
export class ClassificationRuleService {
  constructor(private prisma: PrismaService) {}

  createClassificationRule(
    userId: number,
    dto: CreateClassificationRule,
  ): Promise<ClassificationRule> {
    return this.prisma.classificationRule.create({
      data: {
        name: dto.name,
        topic: dto.topic,
        fileName: dto.fileName,
        filePath: dto.filePath,
        userId,
      },
    });
  }

  getAllClassificationRules(userId: number): Promise<ClassificationRule[]> {
    return this.prisma.classificationRule.findMany({ where: { userId } });
  }

  deleteClassificationRule(id: number): Promise<ClassificationRule> {
    return this.prisma.classificationRule.delete({ where: { id } });
  }
}
