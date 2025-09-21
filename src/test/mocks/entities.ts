import { CompanyEntity } from '~/core/company/company.entity';

export const mockCompanyEntity: CompanyEntity = {
  id: 'company-1',
  name: 'Acme Corp',
  ownerId: 'user-1',
  recruiterIds: ['user-2'],
  createdAt: new Date(),
  updatedAt: new Date(),
  addRecruiter: jest.fn(),
  removeRecruiter: jest.fn(),
  updateInfo: jest.fn(),
};
