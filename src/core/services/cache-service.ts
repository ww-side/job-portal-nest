export interface CacheService<T = string> {
  set(key: string, value: string, ttlSeconds: number): Promise<void>;
  get(key: string): Promise<T | null>;
  del(key: string): Promise<void>;
}
