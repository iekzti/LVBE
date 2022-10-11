import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import CreateBusinessProcess from 'src/business-process/dto/create-business-process.dto';
import { ClassificationRuleService } from './classification-rule.service';
import CreateClassificationRule from './dto/create-classification-rule.dto';

@ApiTags('Classification-rule')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('classification-rule')
export class ClassificationRuleController {
  constructor(
    private readonly classificationRuleService: ClassificationRuleService,
  ) {}

  @Post()
  createClassificationRule(
    @GetUser('sub') userId: number,
    @Body() dto: CreateClassificationRule,
  ) {
    return this.classificationRuleService.createClassificationRule(userId, dto);
  }

  @Get()
  getAllClassificationRules(@GetUser('sub') userId: number) {
    return this.classificationRuleService.getAllClassificationRules(userId);
  }

  @Delete(':id')
  deleteBusinessRule(@Param('id', ParseIntPipe) id: number) {
    return this.classificationRuleService.deleteClassificationRule(id);
  }
}
