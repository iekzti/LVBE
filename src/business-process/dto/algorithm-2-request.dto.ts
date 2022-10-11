import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export default class RunAlgorithm2Dto {
  @ApiProperty({ type: Number, required: true, example: 1 })
  @IsInt()
  businessProcessId: number;

  @ApiProperty({ type: Number, required: true, example: 1 })
  @IsInt()
  classificationRule1Id: number;

  @ApiProperty({ type: Number, required: true, example: 1 })
  @IsInt()
  classificationRule2Id: number;
}
