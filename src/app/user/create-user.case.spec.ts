import { ConflictException } from '~/core/errors/conflict';
import type { HashService } from '~/core/services/hash-service';
import { UserEntity } from '~/core/user/user.entity';
import type { UserRepository } from '~/core/user/user.repository';

import { CreateUserUseCase } from './create-user.case';

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let hashService: jest.Mocked<HashService>;

  const mockUserData = {
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'plainPassword',
  };

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    hashService = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    createUserUseCase = new CreateUserUseCase(userRepository, hashService);
  });

  it('creates a new user when email does not exist', async () => {
    userRepository.findByEmail.mockResolvedValue(null);
    hashService.hash.mockResolvedValue('hashedPassword');

    const createdUser = new UserEntity({
      ...mockUserData,
      id: '123',
      password: 'hashedPassword',
      phone: '',
      roleId: 2,
      isBanned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    userRepository.create.mockResolvedValue(createdUser);

    const result = await createUserUseCase.execute(mockUserData);

    expect(userRepository.findByEmail.mock.calls[0][0]).toBe(
      mockUserData.email,
    );
    expect(hashService.hash.mock.calls[0]).toEqual([mockUserData.password, 10]);
    expect(userRepository.create.mock.calls[0][0]).toEqual({
      ...mockUserData,
      password: 'hashedPassword',
    });
    expect(result).toBe(createdUser);
  });

  it('throws ConflictException if email already exists', async () => {
    userRepository.findByEmail.mockResolvedValue(
      new UserEntity({
        ...mockUserData,
        id: 'existing-user',
        password: 'hashedPassword',
        phone: '',
        roleId: 2,
        isBanned: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    await expect(createUserUseCase.execute(mockUserData)).rejects.toThrow(
      ConflictException,
    );

    expect(userRepository.create.mock.calls).toHaveLength(0);
    expect(hashService.hash.mock.calls).toHaveLength(0);
  });
});
