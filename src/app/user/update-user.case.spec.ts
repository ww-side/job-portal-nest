import { ConflictException } from '~/core/errors/conflict';
import { NotFoundException } from '~/core/errors/not-found';
import type { HashService } from '~/core/services/hash-service';
import { UserEntity } from '~/core/user/user.entity';
import type { UserRepository } from '~/core/user/user.repository';

import { UpdateUserUseCase } from './update-user.case';

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let hashService: jest.Mocked<HashService>;

  const existingUser = new UserEntity({
    id: '123',
    email: 'old@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '',
    roleId: 2,
    isBanned: false,
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  });

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

    updateUserUseCase = new UpdateUserUseCase(userRepository, hashService);
  });

  it('updates user successfully', async () => {
    const newData = {
      email: 'new@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      password: 'newPassword',
      phone: '123456789',
    };

    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.findByEmail.mockResolvedValue(null);
    hashService.hash.mockResolvedValue('newHashedPassword');

    const updatedUser = new UserEntity({
      ...existingUser,
      ...newData,
      password: 'newHashedPassword',
    });
    userRepository.update.mockResolvedValue(updatedUser);

    const result = await updateUserUseCase.execute(existingUser.id, newData);

    expect(userRepository.findById.mock.calls[0][0]).toBe(existingUser.id);
    expect(userRepository.findByEmail.mock.calls[0][0]).toBe(newData.email);
    expect(hashService.hash.mock.calls[0]).toEqual([newData.password, 10]);
    expect(userRepository.update.mock.calls[0]).toEqual([
      existingUser.id,
      {
        ...newData,
        password: 'newHashedPassword',
      },
    ]);
    expect(result).toBe(updatedUser);
  });

  it('throws NotFoundException if user not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(
      updateUserUseCase.execute('nonexistent', { email: 'a@b.com' }),
    ).rejects.toThrow(NotFoundException);

    expect(userRepository.update.mock.calls.length).toBe(0);
    expect(hashService.hash.mock.calls.length).toBe(0);
  });

  it('throws ConflictException if email already exists', async () => {
    const newData = { email: 'existing@example.com' };
    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.findByEmail.mockResolvedValue(
      new UserEntity({
        ...existingUser,
        id: 'other-id',
      }),
    );

    await expect(
      updateUserUseCase.execute(existingUser.id, newData),
    ).rejects.toThrow(ConflictException);

    expect(userRepository.update.mock.calls.length).toBe(0);
    expect(hashService.hash.mock.calls.length).toBe(0);
  });

  it('keeps old password if password is not provided', async () => {
    const newData = { firstName: 'Jane' };
    userRepository.findById.mockResolvedValue(existingUser);
    userRepository.update.mockResolvedValue(
      new UserEntity({ ...existingUser, ...newData }),
    );

    const result = await updateUserUseCase.execute(existingUser.id, newData);

    expect(hashService.hash.mock.calls.length).toBe(0);
    expect(userRepository.update.mock.calls[0]).toEqual([
      existingUser.id,
      {
        ...newData,
        password: existingUser.password,
      },
    ]);
    expect(result.firstName).toBe('Jane');
  });
});
