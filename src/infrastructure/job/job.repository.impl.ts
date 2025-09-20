import { Prisma } from 'generated/prisma';

import { JobEntity } from '~/core/job/job.entity';
import {
  CreateJobData,
  JobRepository,
  UpdateJobData,
} from '~/core/job/job.repository';

import { createPaginatedResponse, getPagination } from '~/app/utils/pagination';

import type { DbService } from '~/framework/db/db.service';

export class JobRepositoryImpl implements JobRepository {
  constructor(private readonly db: DbService) {}

  async get(id: string) {
    const job = await this.db.job.findUnique({ where: { id } });
    if (!job) return null;

    return new JobEntity({
      id: job.id,
      title: job.title,
      description: job.description,
      companyId: job.companyId,
      location: job.location,
      salaryMin: job.salaryMin?.toNumber() ?? undefined,
      salaryMax: job.salaryMax?.toNumber() ?? undefined,
      statusId: job.statusId,
      typeId: job.typeId,
      skills: job.skills ?? [],
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  }

  async getAll(options?: {
    ids?: string[];
    companyId?: string;
    page?: number;
    pageSize?: number;
  }) {
    const where: Prisma.JobWhereInput = {};
    if (options?.ids) where.id = { in: options.ids };
    if (options?.companyId) where.companyId = options.companyId;

    const { page, pageSize, skip, take } = getPagination(options);

    const totalItems = await this.db.job.count({ where });

    const jobs = await this.db.job.findMany({ where, skip, take });

    const data = jobs.map(
      (job) =>
        new JobEntity({
          id: job.id,
          title: job.title,
          description: job.description,
          companyId: job.companyId,
          location: job.location,
          salaryMin: job.salaryMin?.toNumber() ?? undefined,
          salaryMax: job.salaryMax?.toNumber() ?? undefined,
          statusId: job.statusId,
          typeId: job.typeId,
          skills: job.skills ?? [],
          createdAt: job.createdAt,
          updatedAt: job.updatedAt,
        }),
    );

    return createPaginatedResponse({ items: data, totalItems, page, pageSize });
  }

  async create(data: CreateJobData) {
    const job = await this.db.job.create({
      data: {
        title: data.title,
        description: data.description,
        companyId: data.companyId,
        location: data.location,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        statusId: data.statusId,
        typeId: data.typeId,
        skills: data.skills ?? [],
      },
    });

    return new JobEntity({
      id: job.id,
      title: job.title,
      description: job.description,
      companyId: job.companyId,
      location: job.location,
      salaryMin: job.salaryMin?.toNumber() ?? undefined,
      salaryMax: job.salaryMax?.toNumber() ?? undefined,
      statusId: job.statusId,
      typeId: job.typeId,
      skills: job.skills ?? [],
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  }

  async update(id: string, data: UpdateJobData) {
    const job = await this.db.job.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        location: data.location,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        statusId: data.statusId,
        typeId: data.typeId,
        skills: data.skills,
      },
    });

    return new JobEntity({
      id: job.id,
      title: job.title,
      description: job.description,
      companyId: job.companyId,
      location: job.location,
      salaryMin: job.salaryMin?.toNumber() ?? undefined,
      salaryMax: job.salaryMax?.toNumber() ?? undefined,
      statusId: job.statusId,
      typeId: job.typeId,
      skills: job.skills ?? [],
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  }

  async delete(id: string) {
    const job = await this.db.job.delete({ where: { id } });

    return new JobEntity({
      id: job.id,
      title: job.title,
      description: job.description,
      companyId: job.companyId,
      location: job.location,
      salaryMin: job.salaryMin?.toNumber() ?? undefined,
      salaryMax: job.salaryMax?.toNumber() ?? undefined,
      statusId: job.statusId,
      typeId: job.typeId,
      skills: job.skills ?? [],
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  }

  async addSkill(jobId: string, skill: string) {
    const job = await this.db.job.update({
      where: { id: jobId },
      data: { skills: { push: skill } },
    });

    return new JobEntity({
      id: job.id,
      title: job.title,
      description: job.description,
      companyId: job.companyId,
      location: job.location,
      salaryMin: job.salaryMin?.toNumber() ?? undefined,
      salaryMax: job.salaryMax?.toNumber() ?? undefined,
      statusId: job.statusId,
      typeId: job.typeId,
      skills: job.skills ?? [],
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  }

  async removeSkill(jobId: string, skill: string) {
    const currentJob = await this.db.job.findUnique({ where: { id: jobId } });
    if (!currentJob) throw new Error('Job not found');

    const updatedSkills = (currentJob.skills ?? []).filter((s) => s !== skill);
    const job = await this.db.job.update({
      where: { id: jobId },
      data: { skills: updatedSkills },
    });

    return new JobEntity({
      id: job.id,
      title: job.title,
      description: job.description,
      companyId: job.companyId,
      location: job.location,
      salaryMin: job.salaryMin?.toNumber() ?? undefined,
      salaryMax: job.salaryMax?.toNumber() ?? undefined,
      statusId: job.statusId,
      typeId: job.typeId,
      skills: job.skills ?? [],
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  }
}
