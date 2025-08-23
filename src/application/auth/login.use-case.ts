import { CacheService } from '~/core/services/cache-service';
import { HashService } from '~/core/services/hash-service';
import { TokenService } from '~/core/services/token-service';
import { UserRepository } from '~/core/user/user.repository';

export class LoginUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly cacheService: CacheService,
    private readonly tokenService: TokenService,
    private readonly hashService: HashService,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) throw new Error('User not found');

    const isPasswordValid = await this.hashService.compare(
      password,
      user.password,
    );
    if (!isPasswordValid) throw new Error('Invalid password');

    const accessToken = this.tokenService.sign({ id: user.id }, '15m');
    const refreshToken = this.tokenService.sign({ id: user.id }, '7d');
    const hashedRefreshToken = await this.hashService.hash(refreshToken, 10);

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 7);

    await this.cacheService.set(
      `session:${user.id}`,
      JSON.stringify({
        userId: user.id,
        refreshToken: hashedRefreshToken,
        expireDate: expireDate.toISOString(),
      }),
      60 * 60 * 24 * 7,
    );

    return {
      accessToken,
      refreshToken,
      user: { ...user, password: undefined },
    };
  }
}
