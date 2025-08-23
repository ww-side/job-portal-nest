import * as bcrypt from 'bcrypt';
import { HashService } from '~/core/services/hash-service';

export class HashServiceImpl implements HashService {
  async hash(value: string, saltOrRounds: number): Promise<string> {
    return bcrypt.hash(value, saltOrRounds);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
