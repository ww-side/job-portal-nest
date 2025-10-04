import { Cache } from 'cache-manager';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { CreateUserUseCase } from '~/app/user/create-user.case';
import { DeleteUserUseCase } from '~/app/user/delete-user.case';
import { UpdateUserUseCase } from '~/app/user/update-user.case';

import { HashServiceImpl } from '~/infrastructure/services/hash-service.impl';
import { TokenServiceImpl } from '~/infrastructure/services/token-service.impl';
import { UserRepositoryImpl } from '~/infrastructure/user/user.repository.impl';

import { CacheServiceImpl } from '~/framework/cache/cache-service.impl';
import { DbModule } from '~/framework/db/db.module';
import { DbService } from '~/framework/db/db.service';
import { JwtAuthGuard } from '~/framework/shared/guards/jwt-auth';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [DbModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtAuthGuard,
    {
      provide: UserRepositoryImpl,
      useFactory: (db: DbService) => new UserRepositoryImpl(db),
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
      useFactory: (repo: UserRepositoryImpl, hash: HashServiceImpl) =>
        new CreateUserUseCase(repo, hash),
      inject: [UserRepositoryImpl, HashServiceImpl],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (repo: UserRepositoryImpl, hash: HashServiceImpl) =>
        new UpdateUserUseCase(repo, hash),
      inject: [UserRepositoryImpl, HashServiceImpl],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (repo: UserRepositoryImpl) => new DeleteUserUseCase(repo),
      inject: [UserRepositoryImpl],
    },
  ],
  exports: [UserRepositoryImpl],
})
export class UsersModule {}
