import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUserId } from '../shared/decorators/current-user-id';
import { JwtAuthGuard } from '../shared/guards/jwt-auth';
import {
  CreateCompanyDoc,
  DeleteCompanyDoc,
  UpdateCompanyDoc,
} from './company.docs';
import { CompanyService } from './company.service';
import { CreateCompanyDTO, UpdateCompanyDTO } from './dto';

@Controller('company')
@UseGuards(JwtAuthGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  @CreateCompanyDoc()
  async create(@CurrentUserId() id: string, @Body() dto: CreateCompanyDTO) {
    return this.companyService.create({ ...dto, ownerId: id });
  }

  @Patch(':id')
  @UpdateCompanyDoc()
  async update(
    @CurrentUserId() ownerId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCompanyDTO,
  ) {
    return this.companyService.update(id, { ...dto, ownerId });
  }

  @Delete(':id')
  @DeleteCompanyDoc()
  async delete(@CurrentUserId() ownerId: string, @Param('id') id: string) {
    return this.companyService.delete({ companyId: id, ownerId });
  }
}
