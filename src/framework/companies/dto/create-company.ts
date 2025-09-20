import { IsOptional, IsString } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCompanyDTO {
  @ApiProperty({ example: 'Acme Inc.', description: 'Company name' })
  @IsString()
  name: string;

  @ApiPropertyOptional({
    example: 'We build rockets 🚀',
    description: 'Short company description',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://acme.com',
    description: 'Company website URL',
  })
  @IsString()
  @IsOptional()
  website?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.acme.com/logo.png',
    description: 'Logo URL',
  })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({
    example: ['64f2c4d8e1b0c3a5b6f8d123', '64f2c4d8e1b0c3a5b6f8d456'],
    description: 'List of recruiter user IDs',
  })
  @IsString({ each: true })
  @IsOptional()
  recruiterIds?: string[];
}
