import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './user.service';
import { CreateUserDTO } from './dto/create-user';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDTO) {
    return this.usersService.create(dto);
  }
}
