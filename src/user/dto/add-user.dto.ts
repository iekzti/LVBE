import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import {
    IsDateString,
    IsEmail,
    IsNotEmpty,
    IsString
} from 'class-validator';

export default class AddUserDto {
  @ApiProperty({ type: String, required: true, example: 'email@gmail.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ type: String, required: true, example: 'First name' })
  @IsString()
  firstName: string;

  @ApiProperty({ type: String, required: true, example: 'Last name' })
  @IsString()
  lastName: string;

  @ApiProperty({ type: String, required: true, example: '0123 456 789' })
  @IsString()
  phone: string;

  @ApiProperty({ type: String, required: true, example: 'Address' })
  @IsString()
  address: string;

  @ApiProperty({ type: Date, required: true })
  @IsDateString()
  birth: string;

  @ApiProperty({ type: String, required: true, example: 'Password' })
  @IsString()
  password: string;
}
