import { Cache } from 'cache-manager';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { CreateUserUseCase } from '~/application/user/create-user.use-case';
import { DeleteUserUseCase } from '~/application/user/delete-user.use-case';
import { UpdateUserUseCase } from '~/application/user/update-user.use-case';

import { HashServiceImpl } from '~/infrastructure/services/hash-service.impl';
import { TokenServiceImpl } from '~/infrastructure/services/token-service.impl';
import { PrismaUserRepository } from '~/infrastructure/user/user.repository.impl';

import { CacheServiceImpl } from '~/framework/cache/cache-service.impl';
import { DbModule } from '~/framework/db/db.module';

import { DbService } from '../db/db.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';

@Module({
  imports: [DbModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtAuthGuard,
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
      provide: UpdateUserUseCase,
      useFactory: (repo: PrismaUserRepository, hash: HashServiceImpl) =>
        new UpdateUserUseCase(repo, hash),
      inject: [PrismaUserRepository, HashServiceImpl],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (repo: PrismaUserRepository) => new DeleteUserUseCase(repo),
      inject: [PrismaUserRepository],
    },
  ],
  exports: [PrismaUserRepository],
})
export class UsersModule {}
