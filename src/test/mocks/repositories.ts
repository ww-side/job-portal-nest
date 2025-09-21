import { CompanyRepository } from '~/core/company/company.repository';
import { JobRepository } from '~/core/job/job.repository';

export const mockJobRepository: jest.Mocked<JobRepository> = {
  create: jest.fn(),
  get: jest.fn(),
  getAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  addSkill: jest.fn(),
  removeSkill: jest.fn(),
};

export const mockCompanyRepository: jest.Mocked<CompanyRepository> = {
  get: jest.fn(),
  getByOwnerId: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  addRecruiter: jest.fn(),
  removeRecruiter: jest.fn(),
  getAll: jest.fn(),
};
