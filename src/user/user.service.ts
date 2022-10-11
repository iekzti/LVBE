import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import AddUserDto from './dto/add-user.dto';
import UpdateUserDto from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => {
      delete u.hash;
      return u;
    });
  }

  async findUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    delete user.hash;
    return user;
  }

  updateUSer(id: number, dto: UpdateUserDto): Promise<User> {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        email: dto.email,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        address: dto.address,
        birth: new Date(dto.birth),
      },
    });
  }

  async addUser(dto: AddUserDto) {
    await this.authService.signup({
      email: dto.email,
      password: dto.password,
    });
    return this.prisma.user.update({
      where: { email: dto.email },
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        address: dto.address,
        birth: new Date(dto.birth),
      },
    });
  }

  async deleteUser(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
