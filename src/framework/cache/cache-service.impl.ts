import { Cache } from 'cache-manager';
import { CacheService } from '~/core/services/cache-service';
import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheServiceImpl implements CacheService<string> {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.cacheManager.set(key, value, ttlSeconds);
  }

  async get(key: string): Promise<string | null> {
    const value = await this.cacheManager.get<string>(key);
    return value ?? null;
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
