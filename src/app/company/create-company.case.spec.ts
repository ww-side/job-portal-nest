import { CompanyEntity } from '~/core/company/company.entity';
import {
  CompanyRepository,
  CreateCompanyData,
} from '~/core/company/company.repository';
import { ConflictException } from '~/core/errors/conflict';
import { UserEntity } from '~/core/user/user.entity';
import { UserRepository } from '~/core/user/user.repository';

import { CreateCompanyUseCase } from './create-company.case';

describe('CreateCompanyUseCase', () => {
  let useCase: CreateCompanyUseCase;
  let companyRepository: jest.Mocked<CompanyRepository>;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    companyRepository = {
      findById: jest.fn(),
      findByOwnerId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      addRecruiter: jest.fn(),
      removeRecruiter: jest.fn(),
    };

    userRepository = {
      findById: jest.fn().mockImplementation((id: string) =>
        Promise.resolve(
          new UserEntity({
            id,
            email: 'owner@example.com',
            firstName: 'John',
            lastName: 'Doe',
            roleId: 2,
            isBanned: false,
            password: 'hashedPassword',
            createdAt: new Date(),
            updatedAt: new Date(),
          }),
        ),
      ),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    useCase = new CreateCompanyUseCase(companyRepository, userRepository);
  });

  it('creates a new company if owner has no company', async () => {
    const data: CreateCompanyData = {
      name: 'Test Company',
      ownerId: 'owner-123',
    };

    companyRepository.findByOwnerId.mockResolvedValue(null);
    companyRepository.create.mockImplementation(async (input) => {
      return await Promise.resolve(
        new CompanyEntity({
          ...input,
          id: 'company-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      );
    });

    const company = await useCase.execute(data);

    expect(companyRepository.findByOwnerId.mock.calls[0][0]).toBe('owner-123');
    expect(companyRepository.create.mock.calls[0][0]).toEqual({
      ...data,
      recruiterIds: [],
    });
    expect(company).toBeInstanceOf(CompanyEntity);
    expect(company.id).toBe('company-123');
  });

  it('throws ConflictException if owner already has a company', async () => {
    const data: CreateCompanyData = {
      name: 'Test Company',
      ownerId: 'owner-123',
    };

    companyRepository.findByOwnerId.mockResolvedValue(
      new CompanyEntity({
        id: 'company-123',
        name: 'Existing Company',
        ownerId: 'owner-123',
        recruiterIds: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await expect(useCase.execute(data)).rejects.toThrow(ConflictException);
    expect(companyRepository.create.mock.calls).toHaveLength(0);
  });
});
