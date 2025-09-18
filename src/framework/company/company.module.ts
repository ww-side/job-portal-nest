import { Module } from '@nestjs/common';

import { CompanyRepository } from '~/core/company/company.repository';
import { UserRepository } from '~/core/user/user.repository';

import { CompanyRepositoryImpl } from '~/infrastructure/company/company.repository.impl';
import { TokenServiceImpl } from '~/infrastructure/services/token-service.impl';
import { PrismaUserRepository } from '~/infrastructure/user/user.repository.impl';

import { DbModule } from '../db/db.module';
import { DbService } from '../db/db.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth';
import { CompanyController } from './company.controller';
import { CompanyService } from './company.service';
import { AddRecruiterUseCase } from '~/app/company/add-recruiter.case';
import { CreateCompanyUseCase } from '~/app/company/create-company.case';
import { DeleteCompanyUseCase } from '~/app/company/delete-company.case';
import { RemoveRecruiterUseCase } from '~/app/company/remove-recruiter.case';
import { UpdateCompanyUseCase } from '~/app/company/update-company.case';

@Module({
  imports: [DbModule],
  controllers: [CompanyController],
  providers: [
    CompanyService,
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
  ],
})
export class CompanyModule {}
