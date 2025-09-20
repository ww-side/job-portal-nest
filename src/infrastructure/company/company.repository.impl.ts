import { Prisma } from 'generated/prisma';

import { CompanyEntity } from '~/core/company/company.entity';
import {
  CompanyRepository,
  CreateCompanyData,
  GetCompaniesFilters,
  UpdateCompanyData,
} from '~/core/company/company.repository';

import { createPaginatedResponse, getPagination } from '~/app/utils/pagination';

import type { DbService } from '~/framework/db/db.service';

export class CompanyRepositoryImpl implements CompanyRepository {
  constructor(private readonly db: DbService) {}

  async getAll(filters?: GetCompaniesFilters) {
    const where: Prisma.CompanyWhereInput = {};

    if (filters?.ownerId) {
      where.ownerId = filters.ownerId;
    }

    if (filters?.nameContains) {
      where.name = { contains: filters.nameContains, mode: 'insensitive' };
    }

    const { page, pageSize, skip, take } = getPagination(filters);

    const totalItems = await this.db.company.count({ where });

    const companies = await this.db.company.findMany({
      where,
      include: { recruiters: true },
      skip,
      take,
    });

    const data = companies.map(
      (company) =>
        new CompanyEntity({
          id: company.id,
          name: company.name,
          description: company.description ?? undefined,
          website: company.website ?? undefined,
          logoUrl: company.logoUrl ?? undefined,
          ownerId: company.ownerId,
          recruiterIds: company.recruiters.map((u) => u.id),
          createdAt: company.createdAt,
          updatedAt: company.updatedAt,
        }),
    );

    return createPaginatedResponse({ items: data, totalItems, page, pageSize });
  }

  async get(id: string) {
    const company = await this.db.company.findUnique({
      where: { id },
      include: { recruiters: true },
    });

    if (!company) return null;

    return new CompanyEntity({
      id: company.id,
      name: company.name,
      description: company.description ?? undefined,
      website: company.website ?? undefined,
      logoUrl: company.logoUrl ?? undefined,
      ownerId: company.ownerId,
      recruiterIds: company.recruiters.map((u) => u.id),
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  }

  async getByOwnerId(ownerId: string) {
    const company = await this.db.company.findUnique({
      where: { ownerId },
      include: { recruiters: true },
    });

    if (!company) return null;

    return new CompanyEntity({
      id: company.id,
      name: company.name,
      description: company.description ?? undefined,
      website: company.website ?? undefined,
      logoUrl: company.logoUrl ?? undefined,
      ownerId: company.ownerId,
      recruiterIds: company.recruiters.map((u) => u.id),
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  }

  async create(data: CreateCompanyData) {
    const company = await this.db.company.create({
      data: {
        name: data.name,
        description: data.description,
        website: data.website,
        logoUrl: data.logoUrl,
        ownerId: data.ownerId,
        recruiters: {
          connect: (data.recruiterIds ?? []).map((id) => ({ id })),
        },
      },
      include: { recruiters: true },
    });

    return new CompanyEntity({
      id: company.id,
      name: company.name,
      description: company.description ?? undefined,
      website: company.website ?? undefined,
      logoUrl: company.logoUrl ?? undefined,
      ownerId: company.ownerId,
      recruiterIds: company.recruiters.map((u) => u.id),
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  }

  async update(id: string, data: UpdateCompanyData) {
    const company = await this.db.company.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        website: data.website,
        logoUrl: data.logoUrl,
      },
      include: { recruiters: true },
    });

    return new CompanyEntity({
      id: company.id,
      name: company.name,
      description: company.description ?? undefined,
      website: company.website ?? undefined,
      logoUrl: company.logoUrl ?? undefined,
      ownerId: company.ownerId,
      recruiterIds: company.recruiters.map((u) => u.id),
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  }

  async delete(id: string) {
    const company = await this.db.company.delete({
      where: { id },
      include: { recruiters: true },
    });

    return new CompanyEntity({
      id: company.id,
      name: company.name,
      description: company.description ?? undefined,
      website: company.website ?? undefined,
      logoUrl: company.logoUrl ?? undefined,
      ownerId: company.ownerId,
      recruiterIds: company.recruiters.map((u) => u.id),
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  }

  async addRecruiter(companyId: string, userId: string) {
    const company = await this.db.company.update({
      where: { id: companyId },
      data: { recruiters: { connect: { id: userId } } },
      include: { recruiters: true },
    });

    return new CompanyEntity({
      id: company.id,
      name: company.name,
      description: company.description ?? undefined,
      website: company.website ?? undefined,
      logoUrl: company.logoUrl ?? undefined,
      ownerId: company.ownerId,
      recruiterIds: company.recruiters.map((u) => u.id),
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  }

  async removeRecruiter(companyId: string, userId: string) {
    const company = await this.db.company.update({
      where: { id: companyId },
      data: { recruiters: { disconnect: { id: userId } } },
      include: { recruiters: true },
    });

    return new CompanyEntity({
      id: company.id,
      name: company.name,
      description: company.description ?? undefined,
      website: company.website ?? undefined,
      logoUrl: company.logoUrl ?? undefined,
      ownerId: company.ownerId,
      recruiterIds: company.recruiters.map((u) => u.id),
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
    });
  }
}
