import { Module } from '@nestjs/common';
import { ClassificationRuleController } from './classification-rule.controller';
import { ClassificationRuleService } from './classification-rule.service';

@Module({
  controllers: [ClassificationRuleController],
  providers: [ClassificationRuleService]
})
export class ClassificationRuleModule {}
