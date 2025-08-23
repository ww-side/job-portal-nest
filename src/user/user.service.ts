import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { DbService } from '../db/db.service';
import { CreateUserDTO } from './dto/create-user';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { LoginDTO } from './dto/login';

import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { RefreshTokenDTO } from './dto/refresh-token';

@Injectable()
export class UsersService {
  constructor(
    private readonly db: DbService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async create(data: CreateUserDTO) {
    const existingUser = await this.db.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.db.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: await bcrypt.hash(data.password, 10),
        phone: data.phone,
        roleId: data.roleId ?? 2,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        roleId: true,
        isBanned: true,
        createdAt: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        status: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async login(data: LoginDTO) {
    const user = await this.db.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const accessToken = jwt.sign({ id: user.id }, `${process.env.JWT_SECRET}`, {
      expiresIn: '15m',
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      `${process.env.JWT_REFRESH_SECRET}`,
      { expiresIn: '7d' },
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 7);

    const sessionData = {
      userId: user.id,
      refreshToken: hashedRefreshToken,
      expireDate: expireDate.toISOString(),
    };

    await this.cacheManager.set(
      `session:${user.id}`,
      JSON.stringify(sessionData),
      60 * 60 * 24 * 7,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        ...user,
        password: undefined,
      },
    };
  }

  async refreshToken({ refreshToken }: RefreshTokenDTO) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        `${process.env.JWT_REFRESH_SECRET}`,
      ) as { id: number };

      const sessionKey = `session:${decoded.id}`;
      const sessionData = await this.cacheManager.get<string>(sessionKey);

      if (!sessionData) {
        throw new UnauthorizedException('Session expired or not found');
      }

      const session = JSON.parse(sessionData) as {
        userId: number;
        refreshToken: string;
        expireDate: string;
      };

      if (new Date(session.expireDate) < new Date()) {
        throw new UnauthorizedException('Session expired');
      }

      const isValid = await bcrypt.compare(refreshToken, session.refreshToken);

      if (!isValid) {
        await this.cacheManager.del(sessionKey);
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newAccessToken = jwt.sign(
        { id: session.userId },
        `${process.env.JWT_SECRET}`,
        { expiresIn: '15m' },
      );

      const newRefreshToken = jwt.sign(
        { id: session.userId },
        `${process.env.JWT_REFRESH_SECRET}`,
        { expiresIn: '7d' },
      );

      const hashedNewRefreshToken = await bcrypt.hash(newRefreshToken, 10);

      const newExpireDate = new Date();
      newExpireDate.setDate(newExpireDate.getDate() + 7);

      const updatedSession = {
        userId: session.userId,
        refreshToken: hashedNewRefreshToken,
        expireDate: newExpireDate.toISOString(),
      };

      await this.cacheManager.set(
        sessionKey,
        JSON.stringify(updatedSession),
        60 * 60 * 24 * 7,
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
