import { CompanyRepository } from '~/core/company/company.repository';
import { ForbiddenException } from '~/core/errors/forbidden';
import { NotFoundException } from '~/core/errors/not-found';

export class AddRecruiterUseCase {
  constructor(private readonly companyRepository: CompanyRepository) {}

  async execute(companyId: string, userId: string, requesterId: string) {
    const company = await this.companyRepository.get(companyId);

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.ownerId !== requesterId) {
      throw new ForbiddenException('Only owner can add recruiters');
    }

    return this.companyRepository.addRecruiter(companyId, userId);
  }
}
