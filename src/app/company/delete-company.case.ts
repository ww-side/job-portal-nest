import { CompanyEntity } from '~/core/company/company.entity';
import type { CompanyRepository } from '~/core/company/company.repository';
import { ForbiddenException } from '~/core/errors/forbidden';
import { NotFoundException } from '~/core/errors/not-found';

export class DeleteCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(companyId: string, ownerId: string): Promise<CompanyEntity> {
    const company = await this.companyRepository.findById(companyId);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.ownerId !== ownerId) {
      throw new ForbiddenException('Only owner can delete company');
    }

    return await this.companyRepository.delete(companyId);
  }
}
