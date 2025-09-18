import { CompanyEntity } from '~/core/company/company.entity';
import {
  CompanyRepository,
  CreateCompanyData,
  UpdateCompanyData,
} from '~/core/company/company.repository';

import type { DbService } from '~/framework/db/db.service';

export class CompanyRepositoryImpl implements CompanyRepository {
  constructor(private readonly db: DbService) {}

  async findById(id: string): Promise<CompanyEntity | null> {
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

  async findByOwnerId(ownerId: string): Promise<CompanyEntity | null> {
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

  async create(data: CreateCompanyData): Promise<CompanyEntity> {
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

  async update(id: string, data: UpdateCompanyData): Promise<CompanyEntity> {
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

  async delete(id: string): Promise<CompanyEntity> {
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

  async addRecruiter(
    companyId: string,
    userId: string,
  ): Promise<CompanyEntity> {
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

  async removeRecruiter(
    companyId: string,
    userId: string,
  ): Promise<CompanyEntity> {
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
