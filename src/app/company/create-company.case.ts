import { CompanyEntity } from '~/core/company/company.entity';
import {
  CompanyRepository,
  CreateCompanyData,
} from '~/core/company/company.repository';
import { ConflictException } from '~/core/errors/conflict';
import { ForbiddenException } from '~/core/errors/forbidden';
import { UserRepository } from '~/core/user/user.repository';

const EMPLOYER_ROLE_ID = 2;

export class CreateCompanyUseCase {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(data: CreateCompanyData): Promise<CompanyEntity> {
    const existingCompany = await this.companyRepository.findByOwnerId(
      data.ownerId,
    );

    if (existingCompany) {
      throw new ConflictException('Owner already has a company');
    }

    const user = await this.userRepository.findById(data.ownerId);

    if (user?.roleId !== EMPLOYER_ROLE_ID) {
      throw new ForbiddenException(
        'User must have employer role to create company',
      );
    }

    return await this.companyRepository.create({
      ...data,
      recruiterIds: data.recruiterIds ?? [],
    });
  }
}
