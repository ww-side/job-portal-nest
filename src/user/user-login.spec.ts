import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UsersService } from './user.service';
import { DbService } from '../db/db.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

const mockDbService = {
  user: {
    findUnique: jest.fn(),
  },
};

const mockCacheManager = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
};

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: DbService, useValue: mockDbService },
        { provide: CACHE_MANAGER, useValue: mockCacheManager },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('login', () => {
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: 'hashedPassword',
      firstName: 'John',
      lastName: 'Doe',
      phone: '123456789',
      roleId: 3,
    };

    const loginDto = {
      email: 'test@example.com',
      password: 'plainPassword',
    };

    it('throws NotFoundException if user not found', async () => {
      mockDbService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(NotFoundException);
      expect(mockDbService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
    });

    it('throws UnauthorizedException if password invalid', async () => {
      mockDbService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
    });

    it('returns tokens and user data on successful login', async () => {
      mockDbService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock)
        .mockReturnValueOnce('access-token')
        .mockReturnValueOnce('refresh-token');
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-refresh-token');
      mockCacheManager.set.mockResolvedValue(undefined);

      const result = await service.login(loginDto);

      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.password,
      );
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(bcrypt.hash).toHaveBeenCalledWith('refresh-token', 10);
      expect(mockCacheManager.set).toHaveBeenCalledWith(
        `session:${mockUser.id}`,
        expect.any(String),
        60 * 60 * 24 * 7,
      );

      expect(result).toEqual({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: {
          ...mockUser,
          password: undefined,
        },
      });
    });
  });
});
