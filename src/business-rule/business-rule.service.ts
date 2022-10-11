import { Injectable } from '@nestjs/common';
import { BusinessRule, BusinessProcess } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import CreateBusinessRule from './dto/create-business-rule.dto';

@Injectable()
export class BusinessRuleService {
  constructor(private prisma: PrismaService) {}

  async createBusinessProcess(dto: CreateBusinessRule): Promise<BusinessRule> {
    await this.prisma.businessRule.deleteMany( { where: { businessProcessId: dto.businessProcessId}})
    return this.prisma.businessRule.create({
      data: {
        name: dto.name,
        topic: dto.topic,
        fileName: dto.fileName,
        filePath: dto.filePath,
        businessProcessId: dto.businessProcessId,
      },
    });
  }

  getAllBusinessRules(userId: number): Promise<BusinessRule[]> {
    return this.prisma.businessRule.findMany({
      where: { businessProcess: { userId } },
    });
  }

  deleteBusinessRule(id: number): Promise<BusinessRule> {
    return this.prisma.businessRule.delete({ where: { id } });
  }
}
