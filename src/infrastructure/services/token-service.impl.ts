import type { SignOptions } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';

import type { TokenPayload, TokenService } from '~/core/services/token-service';

export class TokenServiceImpl implements TokenService {
  private readonly secret = process.env.JWT_SECRET!;

  sign(payload: object, expiresIn: string): string {
    const options = { expiresIn } as SignOptions;
    return jwt.sign(payload, this.secret, options);
  }

  verify(token: string): TokenPayload {
    const decoded = jwt.verify(token, this.secret);

    if (typeof decoded === 'string') {
      throw new Error('Invalid token payload');
    }

    return decoded as TokenPayload;
  }
}
