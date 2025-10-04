import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentUserId } from '~/framework/shared/decorators/current-user-id';
import { JwtAuthGuard } from '~/framework/shared/guards/jwt-auth';

import { ApplicationsService } from './applications.service';
import { CreateApplicationDTO, UpdateApplicationDTO } from './dto';

@Controller('applications')
@UseGuards(JwtAuthGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Get(':id')
  async get(@Param('id') id: string, @CurrentUserId() currentUserId: string) {
    return this.applicationsService.get(id, currentUserId);
  }

  @Get()
  async getAll(
    @CurrentUserId() currentUserId: string,
    @Query('statusId') statusId?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.applicationsService.getAll({
      filters: {
        statusId,
        page,
        pageSize,
      },
      currentUserId,
    });
  }

  @Post()
  async create(
    @CurrentUserId() currentUserId: string,
    @Body() dto: CreateApplicationDTO,
  ) {
    return this.applicationsService.create({
      ...dto,
      userId: currentUserId,
    });
  }

  @Patch(':id')
  async update(
    @CurrentUserId() currentUserId: string,
    @Param('id') id: string,
    @Body() dto: UpdateApplicationDTO,
    @Query('jobId') jobId: string,
  ) {
    return this.applicationsService.update({
      id,
      data: dto,
      currentUserId,
      jobId,
    });
  }

  @Delete(':id')
  async delete(
    @CurrentUserId() currentUserId: string,
    @Param('id') id: string,
  ) {
    return this.applicationsService.delete({ id, currentUserId });
  }

  @Patch(':id/status')
  async updateStatus(
    @CurrentUserId() currentUserId: string,
    @Param('id') applicationId: string,
    @Body('statusId') newStatusId: string,
  ) {
    return this.applicationsService.updateStatus({
      applicationId,
      newStatusId: String(newStatusId),
      currentUserId,
    });
  }
}
