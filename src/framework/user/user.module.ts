import { Cache } from 'cache-manager';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { LoginUserUseCase } from '~/application/auth/login.use-case';
import { RefreshTokenUseCase } from '~/application/auth/refresh-token.use-case';
import { CreateUserUseCase } from '~/application/user/create-user.use-case';

import { HashServiceImpl } from '~/infrastructure/services/hash-service.impl';
import { TokenServiceImpl } from '~/infrastructure/services/token-service.impl';
import { PrismaUserRepository } from '~/infrastructure/user/user.repository.impl';

import { CacheServiceImpl } from '~/framework/cache/cache-service.impl';
import { DbModule } from '~/framework/db/db.module';

import { DbService } from '../db/db.service';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [DbModule],
  controllers: [UsersController],
  providers: [
    UsersService,
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
      provide: CreateUserUseCase,
      useFactory: (repo: PrismaUserRepository, hash: HashServiceImpl) =>
        new CreateUserUseCase(repo, hash),
      inject: [PrismaUserRepository, HashServiceImpl],
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
  exports: [PrismaUserRepository],
})
export class UsersModule {}
