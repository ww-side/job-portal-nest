import { UnauthorizedException } from '~/core/errors/unauthorized';
import { CacheService } from '~/core/services/cache-service';
import { TokenService } from '~/core/services/token-service';

export class LogoutUserUseCase {
  constructor(
    private readonly cacheService: CacheService,
    private readonly tokenService: TokenService,
  ) {}

  async execute(token: string) {
    try {
      const payload = this.tokenService.verify(token) as { id: string };

      await this.cacheService.del(`session:${payload.id}`);

      return { success: true, message: 'User logged out successfully' };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
