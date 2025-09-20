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

import {
  CreateCompanyDoc,
  DeleteCompanyDoc,
  UpdateCompanyDoc,
} from './companies.docs';
import { CompaniesService } from './companies.service';
import { CreateCompanyDTO, UpdateCompanyDTO } from './dto';

@Controller('companies')
@UseGuards(JwtAuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.companiesService.get(id);
  }

  @Get()
  async getAll(
    @Query('name') nameContains?: string,
    @Query('ownerId') ownerId?: string,
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
  ) {
    return this.companiesService.getAll({
      nameContains,
      ownerId,
      page,
      pageSize,
    });
  }

  @Post()
  @CreateCompanyDoc()
  async create(@CurrentUserId() id: string, @Body() dto: CreateCompanyDTO) {
    return this.companiesService.create({ ...dto, ownerId: id });
  }

  @Patch(':id')
  @UpdateCompanyDoc()
  async update(
    @CurrentUserId() ownerId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDTO,
  ) {
    return this.companiesService.update(id, { ...dto, ownerId });
  }

  @Delete(':id')
  @DeleteCompanyDoc()
  async delete(@CurrentUserId() ownerId: string, @Param('id') id: string) {
    return this.companiesService.delete({ companyId: id, ownerId });
  }
}
