import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import {
  IsDateString,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export default class UpdateTaskDto {
  @ApiProperty({ type: String, required: true, example: 'email@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: Number, required: true, example: 1 })
  @IsInt()
  time: number;

  @ApiProperty({ type: Number, required: true, example: 1 })
  @IsInt()
  businessProcessId: number;
}
