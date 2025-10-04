import { Prisma } from 'generated/prisma';

import {
  ApplicationEntity,
  ApplicationStatusEntity,
} from '~/core/application/application.entity';
import {
  ApplicationRepository,
  ApplicationStatusRepository,
  CreateApplicationData,
  GetApplicationsFilters,
  UpdateApplicationData,
} from '~/core/application/application.repository';

import { EMPLOYER_ROLE_ID } from '~/app/config/roles';
import { createPaginatedResponse, getPagination } from '~/app/utils/pagination';

import type { DbService } from '~/framework/db/db.service';

export class ApplicationRepositoryImpl implements ApplicationRepository {
  constructor(private readonly db: DbService) {}

  async getAll(filters?: GetApplicationsFilters & { ownerCompanyId?: string }) {
    const where: Prisma.ApplicationWhereInput = {};

    if (filters?.userId) where.userId = filters.userId;
    if (filters?.jobId) where.jobId = filters.jobId;
    if (filters?.statusId) where.statusId = filters.statusId;

    if (filters?.ownerCompanyId) {
      where.job = { companyId: filters.ownerCompanyId };
    }

    const { page, pageSize, skip, take } = getPagination(filters);

    const totalItems = await this.db.application.count({ where });

    const applications = await this.db.application.findMany({
      where,
      include: { user: true, job: true, status: true },
      skip,
      take,
    });

    const data = applications.map(
      (app) =>
        new ApplicationEntity({
          id: app.id,
          userId: app.userId,
          jobId: app.jobId,
          message: app.message,
          cvUrl: app.cvUrl ?? undefined,
          statusId: app.statusId,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt,
        }),
    );

    return createPaginatedResponse({ items: data, totalItems, page, pageSize });
  }

  async get(id: string, options?: { currentUserId?: string; roleId?: number }) {
    const app = await this.db.application.findUnique({
      where: { id },
      include: { user: true, job: true, status: true },
    });

    if (!app) return null;

    if (options?.roleId !== undefined && options?.currentUserId !== undefined) {
      if (options.roleId !== EMPLOYER_ROLE_ID) {
        return null;
      }

      const job = await this.db.job.findUnique({
        where: { id: app.jobId },
      });

      if (!job || job.companyId !== options.currentUserId) {
        return null;
      }
    }

    return new ApplicationEntity({
      id: app.id,
      userId: app.userId,
      jobId: app.jobId,
      message: app.message,
      cvUrl: app.cvUrl ?? undefined,
      statusId: app.statusId,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    });
  }

  async create(data: CreateApplicationData) {
    const app = await this.db.application.create({
      data: {
        userId: data.userId,
        jobId: data.jobId,
        message: data.message,
        cvUrl: data.cvUrl,
        statusId: data.statusId,
      },
    });

    return new ApplicationEntity({
      id: app.id,
      userId: app.userId,
      jobId: app.jobId,
      message: app.message,
      cvUrl: app.cvUrl ?? undefined,
      statusId: app.statusId,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    });
  }

  async update(id: string, data: UpdateApplicationData) {
    const app = await this.db.application.update({
      where: { id },
      data: {
        message: data.message,
        cvUrl: data.cvUrl,
        statusId: data.statusId,
      },
    });

    return new ApplicationEntity({
      id: app.id,
      userId: app.userId,
      jobId: app.jobId,
      message: app.message,
      cvUrl: app.cvUrl ?? undefined,
      statusId: app.statusId,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    });
  }

  async delete(id: string) {
    const app = await this.db.application.delete({
      where: { id },
    });

    return new ApplicationEntity({
      id: app.id,
      userId: app.userId,
      jobId: app.jobId,
      message: app.message,
      cvUrl: app.cvUrl ?? undefined,
      statusId: app.statusId,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    });
  }

  async updateStatus(id: string, statusId: string): Promise<ApplicationEntity> {
    const app = await this.db.application.update({
      where: { id },
      data: { statusId },
    });

    return new ApplicationEntity({
      id: app.id,
      userId: app.userId,
      jobId: app.jobId,
      message: app.message,
      cvUrl: app.cvUrl ?? undefined,
      statusId: app.statusId,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    });
  }
}

export class ApplicationStatusRepositoryImpl
  implements ApplicationStatusRepository
{
  constructor(private readonly db: DbService) {}

  async getAll(): Promise<ApplicationStatusEntity[]> {
    const statuses = await this.db.applicationStatus.findMany();

    return statuses.map(
      (status) =>
        new ApplicationStatusEntity({
          id: status.id,
          name: status.name,
        }),
    );
  }
}
