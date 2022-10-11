import { BusinessRuleService } from './business-rule.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import CreateBusinessRule from './dto/create-business-rule.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';

@ApiTags('Business-rule')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('business-rule')
export class BusinessRuleController {
  constructor(private readonly businessRuleService: BusinessRuleService) {}

  @Post()
  createBusinessRule(@Body() dto: CreateBusinessRule) {
    return this.businessRuleService.createBusinessProcess(dto);
  }

  @Get()
  getAllBusinessRules(@GetUser('sub') userId: number) {
    return this.businessRuleService.getAllBusinessRules(userId);
  }

  @Delete(':id')
  deleteBusinessRule(@Param('id', ParseIntPipe) id: number) {
    return this.businessRuleService.deleteBusinessRule(id);
  }
}
