import { ApiProperty } from '@nestjs/swagger/dist/decorators';
import { IsEmail, IsNotEmpty, IsSemVer, IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({
    type: String,
    required: true,
    example: 'admin@gmail.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    example: 'Admin@123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
