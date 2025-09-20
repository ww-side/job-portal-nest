import { Injectable } from '@nestjs/common';

import { CreateCompanyDTO, UpdateCompanyDTO } from './dto';
import { AddRecruiterUseCase } from '~/app/company/add-recruiter.case';
import { CreateCompanyUseCase } from '~/app/company/create-company.case';
import { DeleteCompanyUseCase } from '~/app/company/delete-company.case';
import { RemoveRecruiterUseCase } from '~/app/company/remove-recruiter.case';
import { UpdateCompanyUseCase } from '~/app/company/update-company.case';

@Injectable()
export class CompanyService {
  constructor(
    private readonly createCompanyUseCase: CreateCompanyUseCase,
    private readonly updateCompanyUseCase: UpdateCompanyUseCase,
    private readonly deleteCompanyUseCase: DeleteCompanyUseCase,
    private readonly addRecruiterUseCase: AddRecruiterUseCase,
    private readonly removeRecruiterUseCase: RemoveRecruiterUseCase,
  ) {}

  async create(dto: CreateCompanyDTO & { ownerId: string }) {
    return this.createCompanyUseCase.execute(dto);
  }

  async update(id: string, dto: UpdateCompanyDTO & { ownerId: string }) {
    return this.updateCompanyUseCase.execute(id, dto);
  }

  async delete({ companyId, ownerId }: { companyId: string; ownerId: string }) {
    return this.deleteCompanyUseCase.execute(companyId, ownerId);
  }

  async addRecruiter({
    companyId,
    requesterId,
    userId,
  }: {
    companyId: string;
    userId: string;
    requesterId: string;
  }) {
    return this.addRecruiterUseCase.execute(companyId, userId, requesterId);
  }

  async removeRecruiter({
    companyId,
    userId,
    requesterId,
  }: {
    companyId: string;
    userId: string;
    requesterId: string;
  }) {
    return this.removeRecruiterUseCase.execute(companyId, userId, requesterId);
  }
}
