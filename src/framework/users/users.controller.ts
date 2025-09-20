import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CurrentUserId } from '../shared/decorators/current-user-id';
import { JwtAuthGuard } from '../shared/guards/jwt-auth';
import { CreateUserDTO, UpdateUserDTO } from './dto';
import { CreateUserDoc, DeleteUserDoc, UpdateUserDoc } from './users.docs';
import { UsersService } from './users.service';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @CreateUserDoc()
  async create(@Body() dto: CreateUserDTO) {
    return this.usersService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch()
  @UpdateUserDoc()
  async update(@CurrentUserId() id: string, @Body() dto: UpdateUserDTO) {
    return this.usersService.update(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @DeleteUserDoc()
  async delete(@CurrentUserId() id: string) {
    return this.usersService.delete(id);
  }
}
