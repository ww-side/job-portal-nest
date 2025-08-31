import { NotFoundException } from '~/core/errors/not-found';
import { UserEntity } from '~/core/user/user.entity';
import type { UserRepository } from '~/core/user/user.repository';

import { DeleteUserUseCase } from './delete-user.case';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;

  const mockUser = new UserEntity({
    id: '123',
    email: 'test@example.com',
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
      findById: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    deleteUserUseCase = new DeleteUserUseCase(userRepository);
  });

  it('should delete the user and return it if it exists', async () => {
    userRepository.findById.mockResolvedValue(mockUser);
    userRepository.delete.mockResolvedValue(mockUser);

    const result = await deleteUserUseCase.execute(mockUser.id);

    expect(userRepository.findById.mock.calls[0][0]).toBe(mockUser.id);
    expect(userRepository.delete.mock.calls[0][0]).toBe(mockUser.id);
    expect(result).toBe(mockUser);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(deleteUserUseCase.execute('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );

    expect(userRepository.delete.mock.calls.length).toBe(0);
  });
});
