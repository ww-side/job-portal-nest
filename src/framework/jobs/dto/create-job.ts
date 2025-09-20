import {
  IsArray,
  IsDecimal,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUUID()
  companyId: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'salaryMin must be a decimal number' },
  )
  salaryMin?: number;

  @IsOptional()
  @IsDecimal(
    { decimal_digits: '0,2' },
    { message: 'salaryMax must be a decimal number' },
  )
  salaryMax?: number;

  @IsNotEmpty()
  statusId: string;

  @IsNotEmpty()
  typeId: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];
}
