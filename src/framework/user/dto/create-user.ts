import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDTO {
  @ApiProperty({
    example: 'john@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'StrongPassword123',
    description: 'User password (min 6 chars)',
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: '+380931112233',
    required: false,
    description: 'Phone number (optional)',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: 1,
    required: false,
    description: 'Role ID (optional)',
  })
  @IsOptional()
  @IsInt()
  roleId?: number;
}
