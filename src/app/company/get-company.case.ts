import { CompanyRepository } from '~/core/company/company.repository';
import { NotFoundException } from '~/core/errors/not-found';

export class GetCompanyUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(id: string) {
    const company = await this.companyRepository.get(id);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return company;
  }
}
