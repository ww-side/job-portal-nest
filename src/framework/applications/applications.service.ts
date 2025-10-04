import { Injectable } from '@nestjs/common';

import { CreateApplicationUseCase } from '~/app/application/create-application.case';
import { DeleteApplicationUseCase } from '~/app/application/delete-application.case';
import { GetAllApplicationsUseCase } from '~/app/application/get-all-applications.case';
import { GetApplicationUseCase } from '~/app/application/get-application.case';
import { UpdateApplicationUseCase } from '~/app/application/update-application.case';
import { UpdateApplicationStatusUseCase } from '~/app/application/update-status-application.case';

import { CreateApplicationDTO, UpdateApplicationDTO } from './dto';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly createApplicationUseCase: CreateApplicationUseCase,
    private readonly updateApplicationUseCase: UpdateApplicationUseCase,
    private readonly deleteApplicationUseCase: DeleteApplicationUseCase,
    private readonly getApplicationUseCase: GetApplicationUseCase,
    private readonly getAllApplicationsUseCase: GetAllApplicationsUseCase,
    private readonly updateApplicationStatusUseCase: UpdateApplicationStatusUseCase,
  ) {}

  async get(id: string, currentUserId: string) {
    return this.getApplicationUseCase.execute({
      id,
      currentUserId,
    });
  }

  async getAll({
    filters,
    currentUserId,
  }: {
    filters?: {
      userId?: string;
      jobId?: string;
      statusId?: string;
      page?: number;
      pageSize?: number;
    };
    currentUserId: string;
  }) {
    return this.getAllApplicationsUseCase.execute({
      ...filters,
      currentUserId,
    });
  }

  async create(dto: CreateApplicationDTO & { userId: string }) {
    return this.createApplicationUseCase.execute({
      ...dto,
      statusId: '1',
    });
  }

  async update({
    id,
    data,
    currentUserId,
    jobId,
  }: {
    id: string;
    data: UpdateApplicationDTO;
    currentUserId: string;
    jobId: string;
  }) {
    return this.updateApplicationUseCase.execute({
      id,
      data,
      currentUserId,
      jobId,
    });
  }

  async delete({ id, currentUserId }: { id: string; currentUserId: string }) {
    return this.deleteApplicationUseCase.execute(id, currentUserId);
  }

  async updateStatus({
    applicationId,
    newStatusId,
    currentUserId,
  }: {
    applicationId: string;
    newStatusId: string;
    currentUserId: string;
  }) {
    return this.updateApplicationStatusUseCase.execute({
      applicationId,
      newStatusId,
      currentUserId,
    });
  }
}
