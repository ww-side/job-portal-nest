import { JobEntity } from './job.entity';

export interface CreateJobData {
  title: string;
  description: string;
  companyId: string;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  statusId: string;
  typeId: string;
  skills?: string[];
}

export interface UpdateJobData {
  title?: string;
  description?: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  statusId?: string;
  typeId?: string;
  skills?: string[];
}

export interface JobRepository {
  get(id: string): Promise<JobEntity | null>;
  getAll(options?: {
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
  }>;
  create(data: CreateJobData): Promise<JobEntity>;
  update(id: string, data: UpdateJobData): Promise<JobEntity>;
  delete(id: string): Promise<JobEntity>;
  addSkill(jobId: string, skill: string): Promise<JobEntity>;
  removeSkill(jobId: string, skill: string): Promise<JobEntity>;
}
