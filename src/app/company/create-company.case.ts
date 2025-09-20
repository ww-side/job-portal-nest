import {
  CompanyRepository,
  CreateCompanyData,
} from '~/core/company/company.repository';
import { ConflictException } from '~/core/errors/conflict';
import { ForbiddenException } from '~/core/errors/forbidden';
import { UserRepository } from '~/core/user/user.repository';

import { EMPLOYER_ROLE_ID } from '../config/roles';

export class CreateCompanyUseCase {
  constructor(
    private readonly companyRepository: CompanyRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(data: CreateCompanyData) {
    const existingCompany = await this.companyRepository.getByOwnerId(
      data.ownerId,
    );

    if (existingCompany) {
      throw new ConflictException('Owner already has a company');
    }

    const user = await this.userRepository.getByEmail(data.ownerId);

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
