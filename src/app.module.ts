import { Module } from '@nestjs/common';
import { DbModule } from '~/framework/db/db.module';
import { UsersModule } from '~/framework/user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './framework/auth/auth.module';

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
  ],
})
export class AppModule {}
