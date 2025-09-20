import { Injectable } from '@nestjs/common';

import { CreateJobData, UpdateJobData } from '~/core/job/job.repository';

import { CreateJobUseCase } from '~/app/job/create-job.case';
import { DeleteJobUseCase } from '~/app/job/delete-job.case';
import { GetJobUseCase } from '~/app/job/get-job.case';
import { GetJobsUseCase } from '~/app/job/get-jobs.case';
import { UpdateJobUseCase } from '~/app/job/update-job.case';

@Injectable()
export class JobsService {
  constructor(
    private readonly createJobUseCase: CreateJobUseCase,
    private readonly updateJobUseCase: UpdateJobUseCase,
    private readonly deleteJobUseCase: DeleteJobUseCase,
    private readonly getJobUseCase: GetJobUseCase,
    private readonly getJobsUseCase: GetJobsUseCase,
  ) {}

  async get(options?: {
    id?: string;
    ids?: string[];
    companyId?: string;
    page?: number;
    pageSize?: number;
  }) {
    return this.getJobsUseCase.execute(options);
  }

  async findById(id: string) {
    return this.getJobUseCase.execute(id);
  }

  async create(data: CreateJobData & { createdByUserId: string }) {
    return this.createJobUseCase.execute({
      ...data,
      createdByUserId: data.createdByUserId,
    });
  }

  async update(id: string, data: UpdateJobData & { createdByUserId: string }) {
    return this.updateJobUseCase.execute(id, data.createdByUserId, data);
  }

  async delete(id: string, data: UpdateJobData & { createdByUserId: string }) {
    return this.deleteJobUseCase.execute(id, data.createdByUserId);
  }
}
