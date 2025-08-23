import { UserEntity } from './user.entity';

export interface CreateUserData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
  roleId?: number;
}

export interface UserRepository {
  findByEmail(email: string): Promise<UserEntity>;
  create(data: CreateUserData): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity>;
}
