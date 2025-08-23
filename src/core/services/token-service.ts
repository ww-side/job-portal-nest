export interface TokenService<TVerify = object> {
  sign(payload: object, expiresIn: string): string;
  verify(token: string): TVerify;
}
