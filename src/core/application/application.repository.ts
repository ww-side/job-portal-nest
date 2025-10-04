import { ApplicationEntity } from './application.entity';
import { ApplicationStatusEntity } from './application.entity';

export interface CreateApplicationData {
  userId: string;
  jobId: string;
  message: string;
  cvUrl?: string;
  statusId: string;
}

export interface UpdateApplicationData {
  message?: string;
  cvUrl?: string;
  statusId?: string;
}

export interface GetApplicationsFilters {
  userId?: string;
  jobId?: string;
  statusId?: string;
  page?: number;
  pageSize?: number;
}

export interface ApplicationRepository {
  getAll(filters?: GetApplicationsFilters): Promise<{
    data: ApplicationEntity[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  }>;
  get(id: string): Promise<ApplicationEntity | null>;
  create(data: CreateApplicationData): Promise<ApplicationEntity>;
  update(id: string, data: UpdateApplicationData): Promise<ApplicationEntity>;
  delete(id: string): Promise<ApplicationEntity>;
  updateStatus(id: string, statusId: string): Promise<ApplicationEntity>;
}

export interface ApplicationStatusRepository {
  getAll(): Promise<ApplicationStatusEntity[]>;
}
