import { Module } from '@nestjs/common';

import { CompanyRepository } from '~/core/company/company.repository';

import { CompanyRepositoryImpl } from '~/infrastructure/company/company.repository.impl';
import { JobRepositoryImpl } from '~/infrastructure/job/job.repository.impl';
import { TokenServiceImpl } from '~/infrastructure/services/token-service.impl';

import { DbModule } from '~/framework/db/db.module';
import { DbService } from '~/framework/db/db.service';
import { JwtAuthGuard } from '~/framework/shared/guards/jwt-auth';

import { JobsController } from './job.controller';
import { JobsService } from './job.service';
import { CreateJobUseCase } from '~/app/job/create-job.case';
import { DeleteJobUseCase } from '~/app/job/delete-job.case';
import { UpdateJobUseCase } from '~/app/job/update-job.case';

@Module({
  imports: [DbModule],
  controllers: [JobsController],
  providers: [
    JobsService,
    JwtAuthGuard,
    {
      provide: TokenServiceImpl,
      useFactory: () => new TokenServiceImpl(),
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
      provide: CreateJobUseCase,
      useFactory: (
        jobRepository: JobRepositoryImpl,
        companyRepository: CompanyRepository,
      ) => new CreateJobUseCase({ jobRepository, companyRepository }),
      inject: [JobRepositoryImpl, CompanyRepositoryImpl],
    },
    {
      provide: UpdateJobUseCase,
      useFactory: (
        jobRepository: JobRepositoryImpl,
        companyRepository: CompanyRepository,
      ) => new UpdateJobUseCase({ jobRepository, companyRepository }),
      inject: [JobRepositoryImpl, CompanyRepositoryImpl],
    },
    {
      provide: DeleteJobUseCase,
      useFactory: (
        jobRepository: JobRepositoryImpl,
        companyRepository: CompanyRepository,
      ) => new DeleteJobUseCase({ jobRepository, companyRepository }),
      inject: [JobRepositoryImpl, CompanyRepositoryImpl],
    },
  ],
})
export class JobsModule {}
