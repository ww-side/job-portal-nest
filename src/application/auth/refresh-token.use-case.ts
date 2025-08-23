import { UnauthorizedException } from '@nestjs/common';

import { CacheService } from '~/core/services/cache-service';
import { HashService } from '~/core/services/hash-service';
import { TokenService } from '~/core/services/token-service';

export class RefreshTokenUseCase {
  constructor(
    private readonly cacheService: CacheService<string>,
    private readonly tokenService: TokenService<{ id: number }>,
    private readonly hashService: HashService,
  ) {}

  async execute(refreshToken: string) {
    try {
      const decoded = this.tokenService.verify(refreshToken);
      const sessionKey = `session:${decoded.id}`;
      const sessionData = await this.cacheService.get(sessionKey);

      if (!sessionData)
        throw new UnauthorizedException('Session expired or not found');

      const session = JSON.parse(sessionData) as {
        userId: number;
        refreshToken: string;
        expireDate: string;
      };

      if (new Date(session.expireDate) < new Date()) {
        throw new UnauthorizedException('Session expired');
      }

      const isValid = await this.hashService.compare(
        refreshToken,
        session.refreshToken,
      );
      if (!isValid) {
        await this.cacheService.del(sessionKey);
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = this.tokenService.sign(
        { id: session.userId },
        '15m',
      );
      const newRefreshToken = this.tokenService.sign(
        { id: session.userId },
        '7d',
      );
      const hashedNewRefreshToken = await this.hashService.hash(
        newRefreshToken,
        10,
      );

      const newExpireDate = new Date();
      newExpireDate.setDate(newExpireDate.getDate() + 7);

      await this.cacheService.set(
        sessionKey,
        JSON.stringify({
          userId: session.userId,
          refreshToken: hashedNewRefreshToken,
          expireDate: newExpireDate.toISOString(),
        }),
        60 * 60 * 24 * 7,
      );

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
