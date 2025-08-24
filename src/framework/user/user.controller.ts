import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUserId } from '../shared/decorators/current-user-id';
import { JwtAuthGuard } from '../shared/guards/jwt-auth';
import { CreateUserDTO } from './dto/create-user';
import { UpdateUserDTO } from './dto/update-user';
import { UsersService } from './user.service';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() dto: CreateUserDTO) {
    return this.usersService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  async update(@CurrentUserId() id: string, @Body() dto: UpdateUserDTO) {
    return this.usersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  async delete(@CurrentUserId() id: string) {
    return this.usersService.delete(id);
  }
}
