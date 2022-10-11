import { Module } from '@nestjs/common';
import { BusinessRuleService } from './business-rule.service';
import { BusinessRuleController } from './business-rule.controller';

@Module({
  providers: [BusinessRuleService],
  controllers: [BusinessRuleController]
})
export class BusinessRuleModule {}
