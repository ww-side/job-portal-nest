export class UserEntity {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public firstName: string,
    public lastName: string,
    public phone: string,
    public roleId: number,
    public isBanned: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}

  ban() {
    this.isBanned = true;
  }
}
