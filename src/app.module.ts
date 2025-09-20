import * as redisStore from 'cache-manager-redis-store';

import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { AuthModule } from '~/framework/auth/auth.module';
import { CompaniesModule } from '~/framework/companies/companies.module';
import { DbModule } from '~/framework/db/db.module';
import { JobsModule } from '~/framework/jobs/jobs.module';
import { UsersModule } from '~/framework/users/users.module';

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
    CompaniesModule,
    JobsModule,
  ],
})
export class AppModule {}
