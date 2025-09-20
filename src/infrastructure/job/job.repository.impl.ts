import { Prisma } from 'generated/prisma';

import { JobEntity } from '~/core/job/job.entity';
import {
  CreateJobData,
  JobRepository,
  UpdateJobData,
} from '~/core/job/job.repository';

import type { DbService } from '~/framework/db/db.service';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export class JobRepositoryImpl implements JobRepository {
  constructor(private readonly db: DbService) {}

  async findById(id: string): Promise<JobEntity | null> {
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

  async findMany(options?: {
    ids?: string[];
    companyId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{
    data: JobEntity[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }> {
    const where: Prisma.JobWhereInput = {};
    if (options?.ids) where.id = { in: options.ids };
    if (options?.companyId) where.companyId = options.companyId;

    const page =
      options?.page && options.page > 0 ? options.page : DEFAULT_PAGE;
    const pageSize =
      options?.pageSize && options.pageSize > 0
        ? options.pageSize
        : DEFAULT_PAGE_SIZE;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    // Count total items matching the filter
    const totalItems = await this.db.job.count({ where });
    const totalPages = Math.ceil(totalItems / pageSize);

    const jobs = await this.db.job.findMany({ where, skip, take });

    const items = jobs.map(
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

    return {
      data: items.length ? items : [],
      totalItems,
      totalPages,
      currentPage: page,
      pageSize,
    };
  }

  async create(data: CreateJobData): Promise<JobEntity> {
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

  async update(id: string, data: UpdateJobData): Promise<JobEntity> {
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

  async delete(id: string): Promise<JobEntity> {
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

  async addSkill(jobId: string, skill: string): Promise<JobEntity> {
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

  async removeSkill(jobId: string, skill: string): Promise<JobEntity> {
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
