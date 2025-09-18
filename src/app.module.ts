import * as redisStore from 'cache-manager-redis-store';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { AuthModule } from '~/framework/auth/auth.module';
import { CompanyModule } from '~/framework/company/company.module';
import { DbModule } from '~/framework/db/db.module';
import { UsersModule } from '~/framework/user/user.module';

@Module({
  imports: [
    DbModule,
    CacheModule.register({
      store: redisStore,
      socket: {
        host: 'localhost',
        port: 6379,
      },
      isGlobal: true,
    }),
    UsersModule,
    AuthModule,
    CompanyModule,
  ],
})
export class AppModule {}
