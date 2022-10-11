import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class GetFileDto {
  @ApiProperty({ type: String, required: true, example: 'Path' })
  @IsString()
  path: string;

  @ApiProperty({ type: String, required: true, example: 'File name' })
  @IsString()
  fileName: string;
}
