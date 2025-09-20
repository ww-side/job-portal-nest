import { CompanyEntity } from './company.entity';

export interface CreateCompanyData {
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  recruiterIds?: string[];
  ownerId: string;
}

export interface UpdateCompanyData {
  name?: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  recruiterIds?: string[];
  ownerId: string;
}

export interface GetCompaniesFilters {
  ownerId?: string;
  nameContains?: string;
  page?: number;
  pageSize?: number;
}

export interface CompanyRepository {
  getAll(options?: GetCompaniesFilters): Promise<{
    data: CompanyEntity[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }>;
  get(id: string): Promise<CompanyEntity | null>;
  getByOwnerId(ownerId: string): Promise<CompanyEntity | null>;
  create(data: CreateCompanyData): Promise<CompanyEntity>;
  update(id: string, data: UpdateCompanyData): Promise<CompanyEntity>;
  delete(id: string): Promise<CompanyEntity>;
  addRecruiter(companyId: string, userId: string): Promise<CompanyEntity>;
  removeRecruiter(companyId: string, userId: string): Promise<CompanyEntity>;
}
