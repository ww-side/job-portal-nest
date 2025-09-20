import { Module } from '@nestjs/common';

import { CompanyRepository } from '~/core/company/company.repository';
import { UserRepository } from '~/core/user/user.repository';

import { AddRecruiterUseCase } from '~/app/company/add-recruiter.case';
import { CreateCompanyUseCase } from '~/app/company/create-company.case';
import { DeleteCompanyUseCase } from '~/app/company/delete-company.case';
import { GetCompaniesUseCase } from '~/app/company/get-companies.case';
import { GetCompanyUseCase } from '~/app/company/get-company.case';
import { RemoveRecruiterUseCase } from '~/app/company/remove-recruiter.case';
import { UpdateCompanyUseCase } from '~/app/company/update-company.case';

import { CompanyRepositoryImpl } from '~/infrastructure/company/company.repository.impl';
import { TokenServiceImpl } from '~/infrastructure/services/token-service.impl';
import { PrismaUserRepository } from '~/infrastructure/user/user.repository.impl';

import { DbModule } from '~/framework/db/db.module';
import { DbService } from '~/framework/db/db.service';
import { JwtAuthGuard } from '~/framework/shared/guards/jwt-auth';

import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

@Module({
  imports: [DbModule],
  controllers: [CompaniesController],
  providers: [
    CompaniesService,
    JwtAuthGuard,
    {
      provide: TokenServiceImpl,
      useFactory: () => new TokenServiceImpl(),
    },
    {
      provide: PrismaUserRepository,
      useFactory: (db: DbService) => new PrismaUserRepository(db),
      inject: [DbService],
    },
    {
      provide: CompanyRepositoryImpl,
      useFactory: (db: DbService) => new CompanyRepositoryImpl(db),
      inject: [DbService],
    },
    {
      provide: CreateCompanyUseCase,
      useFactory: (repo: CompanyRepository, userRepo: UserRepository) =>
        new CreateCompanyUseCase(repo, userRepo),
      inject: [CompanyRepositoryImpl, PrismaUserRepository],
    },
    {
      provide: UpdateCompanyUseCase,
      useFactory: (repo: CompanyRepository) => new UpdateCompanyUseCase(repo),
      inject: [CompanyRepositoryImpl],
    },
    {
      provide: DeleteCompanyUseCase,
      useFactory: (repo: CompanyRepository) => new DeleteCompanyUseCase(repo),
      inject: [CompanyRepositoryImpl],
    },
    {
      provide: AddRecruiterUseCase,
      useFactory: (repo: CompanyRepository) => new AddRecruiterUseCase(repo),
      inject: [CompanyRepositoryImpl],
    },
    {
      provide: RemoveRecruiterUseCase,
      useFactory: (repo: CompanyRepository) => new RemoveRecruiterUseCase(repo),
      inject: [CompanyRepositoryImpl],
    },
    {
      provide: GetCompanyUseCase,
      useFactory: (repo: CompanyRepository) => new GetCompanyUseCase(repo),
      inject: [CompanyRepositoryImpl],
    },
    {
      provide: GetCompaniesUseCase,
      useFactory: (repo: CompanyRepository) => new GetCompaniesUseCase(repo),
      inject: [CompanyRepositoryImpl],
    },
  ],
})
export class CompaniesModule {}
