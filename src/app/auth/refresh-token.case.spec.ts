import { UnauthorizedException } from '@nestjs/common';

import type { CacheService } from '~/core/services/cache-service';
import type { HashService } from '~/core/services/hash-service';
import type { TokenService } from '~/core/services/token-service';

import { RefreshTokenUseCase } from './refresh-token.case';

describe('RefreshTokenUseCase', () => {
  let refreshTokenUseCase: RefreshTokenUseCase;
  let cacheService: jest.Mocked<CacheService<string>>;
  let tokenService: jest.Mocked<TokenService>;
  let hashService: jest.Mocked<HashService>;

  const validRefreshToken = 'valid-refresh-token';
  const userId = '123';
  const sessionKey = `session:${userId}`;
  const now = new Date();

  beforeEach(() => {
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

    refreshTokenUseCase = new RefreshTokenUseCase(
      cacheService,
      tokenService,
      hashService,
    );

    jest.useFakeTimers().setSystemTime(now);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('refreshes token successfully when valid', async () => {
    tokenService.verify.mockReturnValue({ id: userId });
    cacheService.get.mockResolvedValue(
      JSON.stringify({
        userId,
        refreshToken: 'hashed-refresh-token',
        expireDate: new Date(now.getTime() + 1000 * 60 * 60).toISOString(),
      }),
    );
    hashService.compare.mockResolvedValue(true);
    tokenService.sign
      .mockReturnValueOnce('new-access-token')
      .mockReturnValueOnce('new-refresh-token');
    hashService.hash.mockResolvedValue('hashed-new-refresh-token');

    const result = await refreshTokenUseCase.execute(validRefreshToken);

    expect(tokenService.verify.mock.calls[0][0]).toBe(validRefreshToken);
    expect(hashService.compare.mock.calls[0]).toEqual([
      validRefreshToken,
      'hashed-refresh-token',
    ]);
    expect(tokenService.sign.mock.calls[0]).toEqual([{ id: userId }, '15m']);
    expect(tokenService.sign.mock.calls[1]).toEqual([{ id: userId }, '7d']);
    expect(hashService.hash.mock.calls[0]).toEqual(['new-refresh-token', 10]);
    expect(cacheService.set.mock.calls[0]).toEqual([
      sessionKey,
      expect.any(String),
      60 * 60 * 24 * 7,
    ]);

    expect(result).toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });
  });

  it('throws UnauthorizedException if session not found', async () => {
    tokenService.verify.mockReturnValue({ id: userId });
    cacheService.get.mockResolvedValue(null);

    await expect(
      refreshTokenUseCase.execute(validRefreshToken),
    ).rejects.toThrow(UnauthorizedException);

    expect(hashService.compare.mock.calls.length).toBe(0);
    expect(tokenService.sign.mock.calls.length).toBe(0);
  });

  it('throws UnauthorizedException if session expired', async () => {
    tokenService.verify.mockReturnValue({ id: userId });
    cacheService.get.mockResolvedValue(
      JSON.stringify({
        userId,
        refreshToken: 'hashed-refresh-token',
        expireDate: new Date(now.getTime() - 1000 * 60).toISOString(),
      }),
    );

    await expect(
      refreshTokenUseCase.execute(validRefreshToken),
    ).rejects.toThrow(UnauthorizedException);

    expect(hashService.compare.mock.calls.length).toBe(0);
  });

  it('throws UnauthorizedException if refresh token is invalid (hash mismatch)', async () => {
    tokenService.verify.mockReturnValue({ id: userId });
    cacheService.get.mockResolvedValue(
      JSON.stringify({
        userId,
        refreshToken: 'hashed-refresh-token',
        expireDate: new Date(now.getTime() + 1000 * 60 * 60).toISOString(),
      }),
    );
    hashService.compare.mockResolvedValue(false);

    await expect(
      refreshTokenUseCase.execute(validRefreshToken),
    ).rejects.toThrow(UnauthorizedException);

    expect(cacheService.del.mock.calls[0][0]).toBe(sessionKey);
  });

  it('throws UnauthorizedException if token verification fails', async () => {
    tokenService.verify.mockImplementation(() => {
      throw new Error('invalid token');
    });

    await expect(refreshTokenUseCase.execute('bad-token')).rejects.toThrow(
      UnauthorizedException,
    );

    expect(cacheService.get.mock.calls.length).toBe(0);
  });
});
