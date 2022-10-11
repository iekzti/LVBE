import { Module } from '@nestjs/common';
import { BusinessProcessService } from './business-process.service';
import { BusinessProcessController } from './business-process.controller';

@Module({
  providers: [BusinessProcessService],
  controllers: [BusinessProcessController]
})
export class BusinessProcessModule {}
