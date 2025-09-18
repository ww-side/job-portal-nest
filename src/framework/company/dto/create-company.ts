import { IsOptional, IsString } from 'class-validator';

export class CreateCompanyDTO {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  logoUrl?: string;

  @IsString({ each: true })
  @IsOptional()
  recruiterIds?: string[];
}
