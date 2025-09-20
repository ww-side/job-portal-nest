import * as bcrypt from 'bcrypt';

import type { HashService } from '~/core/services/hash-service';

export class HashServiceImpl implements HashService {
  async hash(value: string, saltOrRounds: number) {
    return bcrypt.hash(value, saltOrRounds);
  }

  async compare(value: string, hash: string) {
    return bcrypt.compare(value, hash);
  }
}
