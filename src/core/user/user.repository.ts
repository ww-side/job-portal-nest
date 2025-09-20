import { UserEntity } from '~/core/user/user.entity';

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
  roleId?: number;
}

export interface UpdateUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  phone?: string;
}

export interface UserRepository {
  get(id: string): Promise<UserEntity | null>;
  getByEmail(email: string): Promise<UserEntity | null>;
  create(data: CreateUserData): Promise<UserEntity>;
  update(id: string, data: UpdateUserData): Promise<UserEntity>;
  delete(id: string): Promise<UserEntity>;
}
