export interface UserEntityProps {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  isBanned: boolean;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  phone?: string;
}

export class UserEntity {
  public readonly id: string;
  public readonly email: string;
  public firstName: string;
  public lastName: string;
  public roleId: number;
  public isBanned: boolean;
  public password: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public phone?: string;

  constructor(props: UserEntityProps) {
    Object.assign(this, props);
  }

  ban() {
    this.isBanned = true;
  }
}
