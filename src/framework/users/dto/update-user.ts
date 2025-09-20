import { IsEmail, IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty({
    example: 'johnny@example.com',
    required: false,
    description: 'New email (optional)',
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'Johnny',
    required: false,
    description: 'New first name (optional)',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({
    example: 'Dawson',
    required: false,
    description: 'New last name (optional)',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({
    example: 'NewPassword456',
    required: false,
    description: 'New password (optional)',
  })
  @IsOptional()
  @IsString()
  password?: string;

  @ApiProperty({
    example: '+380931112244',
    required: false,
    description: 'New phone number (optional)',
  })
  @IsOptional()
  @IsString()
  phone?: string;
}
