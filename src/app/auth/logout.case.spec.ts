import { UnauthorizedException } from '~/core/errors/unauthorized';
import type { CacheService } from '~/core/services/cache-service';
import type { TokenService } from '~/core/services/token-service';

import { mockCacheService, mockTokenService } from '~/test/mocks/services';

import { LogoutUserUseCase } from './logout.case';

describe('LogoutUserUseCase', () => {
  let logoutUserUseCase: LogoutUserUseCase;
  let cacheService: jest.Mocked<CacheService>;
  let tokenService: jest.Mocked<TokenService>;

  beforeEach(() => {
    cacheService = mockCacheService;
    tokenService = mockTokenService;

    logoutUserUseCase = new LogoutUserUseCase(cacheService, tokenService);
  });

  it('logs out successfully when token is valid', async () => {
    tokenService.verify.mockReturnValue({ id: 'user-123' });

    const result = await logoutUserUseCase.execute('valid-refresh-token');

    expect(tokenService.verify.mock.calls[0][0]).toBe('valid-refresh-token');
    expect(cacheService.del.mock.calls[0][0]).toBe('session:user-123');
    expect(result).toEqual({
      success: true,
      message: 'User logged out successfully',
    });
  });

  it('throws UnauthorizedException when token is invalid', async () => {
    tokenService.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    await expect(logoutUserUseCase.execute('invalid-token')).rejects.toThrow(
      UnauthorizedException,
    );

    expect(cacheService.del.mock.calls.length).toBe(0);
  });
});
