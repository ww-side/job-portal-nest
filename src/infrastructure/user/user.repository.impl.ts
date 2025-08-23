import { UserRepository, CreateUserData } from '~/core/user/user.repository';
import { UserEntity } from '~/core/user/user.entity';
import { DbService } from '~/framework/db/db.service';

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly db: DbService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.db.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        roleId: true,
        isBanned: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });

    if (!user) return null;

    return new UserEntity({
      ...user,
      phone: user.phone ?? '',
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        roleId: true,
        isBanned: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });

    if (!user) return null;

    return new UserEntity({
      ...user,
      phone: user.phone ?? '',
    });
  }

  async create(data: CreateUserData): Promise<UserEntity> {
    const user = await this.db.user.create({
      data,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        roleId: true,
        isBanned: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    });

    return new UserEntity({
      ...user,
      phone: user.phone ?? '',
    });
  }
}
