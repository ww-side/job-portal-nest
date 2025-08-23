import type { SignOptions } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';

import type { TokenService } from '~/core/services/token-service';

export class TokenServiceImpl implements TokenService<{ id: number }> {
  private readonly secret = process.env.JWT_SECRET!;

  sign(payload: object, expiresIn: string): string {
    const options = { expiresIn } as SignOptions;
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string): { id: number } {
    const decoded = jwt.verify(token, this.secret);

    if (typeof decoded === 'string') {
      throw new Error('Invalid token payload');
    }

    return decoded as { id: number };
  }
}
