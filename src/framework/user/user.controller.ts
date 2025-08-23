import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserDTO } from './dto/create-user';
import { UsersService } from './user.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDTO) {
    return this.usersService.create(dto);
  }
}
