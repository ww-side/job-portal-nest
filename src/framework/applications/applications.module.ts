import { Module } from '@nestjs/common';

import {
  ApplicationRepository,
  ApplicationStatusRepository,
} from '~/core/application/application.repository';
import { CompanyRepository } from '~/core/company/company.repository';
import { JobRepository } from '~/core/job/job.repository';
import { UserRepository } from '~/core/user/user.repository';

import { CreateApplicationUseCase } from '~/app/application/create-application.case';
import { DeleteApplicationUseCase } from '~/app/application/delete-application.case';
import { GetAllApplicationStatusesUseCase } from '~/app/application/get-all-application-statuses.case';
import { GetAllApplicationsUseCase } from '~/app/application/get-all-applications.case';
import { GetApplicationUseCase } from '~/app/application/get-application.case';
import { UpdateApplicationUseCase } from '~/app/application/update-application.case';
import { UpdateApplicationStatusUseCase } from '~/app/application/update-status-application.case';

import {
  ApplicationRepositoryImpl,
  ApplicationStatusRepositoryImpl,
} from '~/infrastructure/application/application.repository.impl';
import { CompanyRepositoryImpl } from '~/infrastructure/company/company.repository.impl';
import { JobRepositoryImpl } from '~/infrastructure/job/job.repository.impl';
import { TokenServiceImpl } from '~/infrastructure/services/token-service.impl';
import { UserRepositoryImpl } from '~/infrastructure/user/user.repository.impl';

import { DbModule } from '~/framework/db/db.module';
import { JwtAuthGuard } from '~/framework/shared/guards/jwt-auth';

import { DbService } from '../db/db.service';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

@Module({
  imports: [DbModule],
  exports: [ApplicationsService],
  controllers: [ApplicationsController],
  providers: [
    ApplicationsService,
    JwtAuthGuard,
    {
      provide: TokenServiceImpl,
      useFactory: () => new TokenServiceImpl(),
    },
    {
      provide: UserRepositoryImpl,
      useFactory: (db: DbService) => new UserRepositoryImpl(db),
      inject: [DbService],
    },
    {
      provide: JobRepositoryImpl,
      useFactory: (db: DbService) => new JobRepositoryImpl(db),
      inject: [DbService],
    },
    {
      provide: CompanyRepositoryImpl,
      useFactory: (db: DbService) => new CompanyRepositoryImpl(db),
      inject: [DbService],
    },
    {
      provide: ApplicationRepositoryImpl,
      useFactory: (db: DbService) => new ApplicationRepositoryImpl(db),
      inject: [DbService],
    },
    {
      provide: CreateApplicationUseCase,
      useFactory: (
        repo: ApplicationRepository,
        userRepo: UserRepository,
        jobRepo: JobRepository,
      ) => new CreateApplicationUseCase(repo, userRepo, jobRepo),
      inject: [
        ApplicationRepositoryImpl,
        UserRepositoryImpl,
        JobRepositoryImpl,
      ],
    },
    {
      provide: DeleteApplicationUseCase,
      useFactory: (repo: ApplicationRepository) =>
        new DeleteApplicationUseCase(repo),
      inject: [ApplicationRepositoryImpl],
    },
    {
      provide: GetApplicationUseCase,
      useFactory: (
        repo: ApplicationRepository,
        jobRepo: JobRepository,
        companyRepo: CompanyRepository,
        userRepo: UserRepository,
      ) => new GetApplicationUseCase(repo, jobRepo, companyRepo, userRepo),
      inject: [
        ApplicationRepositoryImpl,
        JobRepositoryImpl,
        CompanyRepositoryImpl,
        UserRepositoryImpl,
      ],
    },
    {
      provide: GetAllApplicationsUseCase,
      useFactory: (
        repo: ApplicationRepository,
        jobRepo: JobRepository,
        companyRepo: CompanyRepository,
        userRepo: UserRepository,
      ) => new GetAllApplicationsUseCase(repo, jobRepo, companyRepo, userRepo),
      inject: [
        ApplicationRepositoryImpl,
        JobRepositoryImpl,
        CompanyRepositoryImpl,
        UserRepositoryImpl,
      ],
    },
    {
      provide: UpdateApplicationUseCase,
      useFactory: (
        repo: ApplicationRepository,
        jobRepo: JobRepository,
        companyRepo: CompanyRepository,
      ) => new UpdateApplicationUseCase(repo, jobRepo, companyRepo),
      inject: [
        ApplicationRepositoryImpl,
        JobRepositoryImpl,
        CompanyRepositoryImpl,
      ],
    },
    {
      provide: UpdateApplicationStatusUseCase,
      useFactory: (
        repo: ApplicationRepository,
        jobRepo: JobRepository,
        companyRepo: CompanyRepository,
      ) => new UpdateApplicationStatusUseCase(repo, jobRepo, companyRepo),
      inject: [
        ApplicationRepositoryImpl,
        JobRepositoryImpl,
        CompanyRepositoryImpl,
      ],
    },
    {
      provide: GetAllApplicationStatusesUseCase,
      useFactory: (repo: ApplicationStatusRepository) =>
        new GetAllApplicationStatusesUseCase(repo),
      inject: [ApplicationStatusRepositoryImpl],
    },
    {
      provide: ApplicationStatusRepositoryImpl,
      useFactory: (db: DbService) => new ApplicationStatusRepositoryImpl(db),
      inject: [DbService],
    },
  ],
})
export class ApplicationsModule {}
