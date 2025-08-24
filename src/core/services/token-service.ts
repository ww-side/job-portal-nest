export interface AuthenticatedRequest {
  user?: TokenPayload;
}

export interface TokenPayload {
  id: string;
}

export interface TokenService {
  sign(payload: object, expiresIn: string): string;
  verify(token: string): TokenPayload;
}
