import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDTO } from './dto/create-user';
import { LoginDTO } from './dto/login';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDTO) {
    return this.usersService.create(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDTO) {
    return this.usersService.login(dto);
  }
}
