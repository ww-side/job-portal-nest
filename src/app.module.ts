import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { UsersModule } from './user/user.module';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

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
  ],
})
export class AppModule {}
