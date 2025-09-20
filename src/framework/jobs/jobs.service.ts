import { Injectable, NotFoundException } from '@nestjs/common';

import { CreateJobData, UpdateJobData } from '~/core/job/job.repository';

import { JobRepositoryImpl } from '~/infrastructure/job/job.repository.impl';

import { CreateJobUseCase } from '~/app/job/create-job.case';
import { DeleteJobUseCase } from '~/app/job/delete-job.case';
import { UpdateJobUseCase } from '~/app/job/update-job.case';

@Injectable()
export class JobsService {
  constructor(
    private readonly jobRepository: JobRepositoryImpl,
    private readonly createJobUseCase: CreateJobUseCase,
    private readonly updateJobUseCase: UpdateJobUseCase,
    private readonly deleteJobUseCase: DeleteJobUseCase,
  ) {}

  async get(options?: {
    id?: string;
    ids?: string[];
    companyId?: string;
    page?: number;
    pageSize?: number;
  }) {
    return this.jobRepository.findMany(options);
  }

  async findById(id: string) {
    const job = await this.jobRepository.findById(id);
    if (!job) throw new NotFoundException('Job not found');
    return job;
  }

  async create(data: CreateJobData & { createdByUserId: string }) {
    return this.createJobUseCase.execute({
      ...data,
      createdByUserId: data.createdByUserId,
    });
  }

  async update(id: string, data: UpdateJobData & { createdByUserId: string }) {
    const existing = await this.jobRepository.findById(id);
    if (!existing) throw new NotFoundException('Job not found');
    return this.updateJobUseCase.execute(id, data.createdByUserId, data);
  }

  async delete(id: string, data: UpdateJobData & { createdByUserId: string }) {
    const existing = await this.jobRepository.findById(id);
    if (!existing) throw new NotFoundException('Job not found');
    return this.deleteJobUseCase.execute(id, data.createdByUserId);
  }
}
