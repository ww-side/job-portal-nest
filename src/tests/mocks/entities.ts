export const mockCompanyEntity = {
  id: 'company-1',
  name: 'Acme Corp',
  ownerId: 'user-1',
  recruiterIds: ['user-2'],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const mockJobEntity = {
  id: 'job-123',
  companyId: 'company-123',
  title: 'Software Engineer',
  description: 'Job description',
  createdAt: new Date(),
  updatedAt: new Date(),
  location: 'Remote',
  salaryMin: 5000,
  salaryMax: 8000,
  statusId: '1',
  typeId: '2',
  skills: ['React', 'Node.js'],
};
