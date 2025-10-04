export const mockHashService = {
  hash: jest.fn(),
  compare: jest.fn(),
};

export const mockCacheService = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

export const mockTokenService = {
  sign: jest.fn(),
  verify: jest.fn(),
};
