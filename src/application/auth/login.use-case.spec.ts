import { UnauthorizedException } from '~/core/errors/unauthorized';
import type { CacheService } from '~/core/services/cache-service';
import type { HashService } from '~/core/services/hash-service';
import type { TokenService } from '~/core/services/token-service';
import { UserEntity } from '~/core/user/user.entity';
import type { UserRepository } from '~/core/user/user.repository';

import { LoginUserUseCase } from './login.use-case';

describe('LoginUserUseCase', () => {
  let loginUserUseCase: LoginUserUseCase;
  let userRepository: jest.Mocked<UserRepository>;
  let cacheService: jest.Mocked<CacheService>;
  let tokenService: jest.Mocked<TokenService>;
  let hashService: jest.Mocked<HashService>;

  const mockUser = new UserEntity({
    id: 'user-123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    password: 'hashedPassword',
    phone: '',
    roleId: 2,
    isBanned: false,
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

    cacheService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    tokenService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    hashService = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    loginUserUseCase = new LoginUserUseCase(
      userRepository,
      cacheService,
      tokenService,
      hashService,
    );
  });

  it('logs in successfully with valid credentials', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);
    hashService.compare.mockResolvedValue(true);
    tokenService.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');
    hashService.hash.mockResolvedValue('hashed-refresh-token');

    const result = await loginUserUseCase.execute(
      mockUser.email,
      'plainPassword',
    );

    expect(userRepository.findByEmail.mock.calls[0][0]).toBe(mockUser.email);
    expect(hashService.compare.mock.calls[0]).toEqual([
      'plainPassword',
      mockUser.password,
    ]);
    expect(tokenService.sign.mock.calls[0]).toEqual([
      { id: mockUser.id },
      '15m',
    ]);
    expect(tokenService.sign.mock.calls[1]).toEqual([
      { id: mockUser.id },
      '7d',
    ]);
    expect(hashService.hash.mock.calls[0]).toEqual(['refresh-token', 10]);
    expect(cacheService.set.mock.calls[0]).toEqual([
      `session:${mockUser.id}`,
      expect.any(String),
      60 * 60 * 24 * 7,
    ]);

    expect(result).toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: { ...mockUser, password: undefined },
    });
  });

  it('throws UnauthorizedException when user is not found', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      loginUserUseCase.execute('notfound@example.com', 'anyPassword'),
    ).rejects.toThrow(UnauthorizedException);

    expect(hashService.compare.mock.calls.length).toBe(0);
    expect(tokenService.sign.mock.calls.length).toBe(0);
    expect(cacheService.set.mock.calls.length).toBe(0);
  });

  it('throws UnauthorizedException when password is invalid', async () => {
    userRepository.findByEmail.mockResolvedValue(mockUser);
    hashService.compare.mockResolvedValue(false);

    await expect(
      loginUserUseCase.execute(mockUser.email, 'wrongPassword'),
    ).rejects.toThrow(UnauthorizedException);

    expect(tokenService.sign.mock.calls.length).toBe(0);
    expect(cacheService.set.mock.calls.length).toBe(0);
  });
});
