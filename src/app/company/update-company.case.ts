import { ForbiddenException } from '@nestjs/common';

import type {
  CompanyRepository,
  UpdateCompanyData,
} from '~/core/company/company.repository';
import { NotFoundException } from '~/core/errors/not-found';

export class UpdateCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(companyId: string, data: UpdateCompanyData) {
    const company = await this.companyRepository.get(companyId);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.ownerId !== data.ownerId) {
      throw new ForbiddenException('Only owner can update company');
    }

    return await this.companyRepository.update(companyId, {
      ...data,
    });
  }
}
