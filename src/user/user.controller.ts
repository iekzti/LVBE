import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger/dist/decorators';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import AddUserDto from './dto/add-user.dto';
import UpdateUserDto from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags("Users")
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll() {
    return this.userService.findAll();
  }

  @Get('me')
  getCurrentUser(@GetUser('sub') userId: number) {
    return this.userService.findUser(userId);
  }

  @Get(':id')
  getMe(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUser(id);
  }

  @Put(':id')
  updateMe(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.userService.updateUSer(id, dto);
  }

  @Post()
  addUser(@Body() dto: AddUserDto) {
    return this.userService.addUser(dto);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }
}
