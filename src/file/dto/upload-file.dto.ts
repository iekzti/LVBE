import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class UploadFileDto {
  @ApiProperty({ type: String, required: true, example: 'File name' })
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: true, enum: ['task', 'bpmn'] })
  @IsString()
  type: string;

  @ApiProperty({ type: String, format: 'binary' })
  file: any;
}
