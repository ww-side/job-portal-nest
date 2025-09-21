import { CompanyRepository } from '~/core/company/company.repository';
import { JobRepository } from '~/core/job/job.repository';
import { UserRepository } from '~/core/user/user.repository';

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

export const mockUserRepository: jest.Mocked<UserRepository> = {
  get: jest.fn(),
  getByEmail: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};
