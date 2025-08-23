import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LoginUserUseCase } from '~/application/auth/login.use-case';
import { RefreshTokenUseCase } from '~/application/auth/refresh-token.use-case';
import { HashServiceImpl } from '~/infrastructure/services/hash-service.impl';
import { TokenServiceImpl } from '~/infrastructure/services/token-service.impl';
import { CacheServiceImpl } from '~/framework/cache/cache-service.impl';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaUserRepository } from '~/infrastructure/user/user.repository.impl';
import { DbService } from '../db/db.service';
import { DbModule } from '~/framework/db/db.module';

@Module({
  imports: [DbModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: PrismaUserRepository,
      useFactory: (db: DbService) => new PrismaUserRepository(db),
      inject: [DbService],
    },
    {
      provide: HashServiceImpl,
      useFactory: () => new HashServiceImpl(),
    },
    {
      provide: TokenServiceImpl,
      useFactory: () => new TokenServiceImpl(),
    },
    {
      provide: CacheServiceImpl,
      useFactory: (cacheManager: Cache) => new CacheServiceImpl(cacheManager),
      inject: [CACHE_MANAGER],
    },
    {
      provide: LoginUserUseCase,
      useFactory: (
        repo: PrismaUserRepository,
        cache: CacheServiceImpl,
        tokenService: TokenServiceImpl,
        hash: HashServiceImpl,
      ) => new LoginUserUseCase(repo, cache, tokenService, hash),
      inject: [
        PrismaUserRepository,
        CacheServiceImpl,
        TokenServiceImpl,
        HashServiceImpl,
      ],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (
        cache: CacheServiceImpl,
        tokenService: TokenServiceImpl,
        hash: HashServiceImpl,
      ) => new RefreshTokenUseCase(cache, tokenService, hash),
      inject: [CacheServiceImpl, TokenServiceImpl, HashServiceImpl],
    },
  ],
  exports: [LoginUserUseCase, RefreshTokenUseCase],
})
export class AuthModule {}
