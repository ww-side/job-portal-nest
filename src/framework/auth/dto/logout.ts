import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}
