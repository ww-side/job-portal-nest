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

import { CurrentUserId } from '../shared/decorators/current-user-id';
import { JwtAuthGuard } from '../shared/guards/jwt-auth';
import { CreateJobDto, UpdateJobDTO } from './dto';
import { JobsService } from './jobs.service';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@CurrentUserId() userId: string, @Body() dto: CreateJobDto) {
    return this.jobsService.create({
      ...dto,
      companyId: dto.companyId,
      createdByUserId: userId,
    });
  }

  @Patch(':id')
  async update(
    @CurrentUserId() userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateJobDTO,
  ) {
    return this.jobsService.update(id, { ...dto, createdByUserId: userId });
  }

  @Delete(':id')
  async delete(@CurrentUserId() userId: string, @Param('id') id: string) {
    return this.jobsService.delete(id, { createdByUserId: userId });
  }

  @Get()
  async get(
    @Query('ids') ids?: string,
    @Query('companyId') companyId?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    const idsArray = ids ? ids.split(',') : undefined;

    return this.jobsService.get({
      ids: idsArray,
      companyId,
      page: Number(page),
      pageSize: Number(pageSize),
    });
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.jobsService.findById(id);
  }
}
