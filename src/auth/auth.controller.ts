import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger/dist';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: AuthDto) {
    return this.authService.signup(dto);
  }

  @Post('signin')
  login(@Body() dto: AuthDto) {
    return this.authService.signin(dto);
  }
}
