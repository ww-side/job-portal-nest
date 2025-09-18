import { ForbiddenException } from '@nestjs/common';

import { CompanyEntity } from '~/core/company/company.entity';
import type {
  CompanyRepository,
  UpdateCompanyData,
} from '~/core/company/company.repository';
import { NotFoundException } from '~/core/errors/not-found';

export class UpdateCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(
    companyId: string,
    data: UpdateCompanyData,
  ): Promise<CompanyEntity> {
    const company = await this.companyRepository.findById(companyId);

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
