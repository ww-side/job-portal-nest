import { NotFoundException } from '~/core/errors/not-found';
import { UserEntity } from '~/core/user/user.entity';
import type { UserRepository } from '~/core/user/user.repository';

import { mockUserRepository } from '~/test/mocks/repositories';

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
    userRepository = mockUserRepository;

    deleteUserUseCase = new DeleteUserUseCase(userRepository);
  });

  it('should delete the user and return it if it exists', async () => {
    userRepository.get.mockResolvedValue(mockUser);
    userRepository.delete.mockResolvedValue(mockUser);

    const result = await deleteUserUseCase.execute(mockUser.id);

    expect(userRepository.get.mock.calls[0][0]).toBe(mockUser.id);
    expect(userRepository.delete.mock.calls[0][0]).toBe(mockUser.id);
    expect(result).toBe(mockUser);
  });

  it('should throw NotFoundException if user does not exist', async () => {
    userRepository.get.mockResolvedValue(null);

    await expect(deleteUserUseCase.execute('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );

    expect(userRepository.delete.mock.calls.length).toBe(0);
  });
});
