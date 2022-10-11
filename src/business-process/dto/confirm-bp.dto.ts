import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export default class ConfirmBPDto {
  @ApiProperty({ type: Number, required: true, example: 1 })
  @IsInt()
  businessProcessId: number;

  @ApiProperty({ type: String, required: true, example: "<xml></xml>" })
  @IsString()
  xml: string;
}
