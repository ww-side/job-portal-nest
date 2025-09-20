import { IsString } from 'class-validator';

export class AddRecruiterDTO {
  @IsString()
  recruiterId: string;
}
