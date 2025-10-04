import { IsOptional, IsString } from 'class-validator';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateApplicationDTO {
  @ApiProperty({
    example: '64f2c4d8e1b0c3a5b6f8d789',
    description: 'ID of the job the application is for',
  })
  @IsString()
  jobId: string;

  @ApiProperty({
    example: 'I am very interested in this role and have attached my CV.',
    description: 'Cover message for the application',
  })
  @IsString()
  message: string;

  @ApiPropertyOptional({
    example: 'https://cdn.example.com/cv.pdf',
    description: 'Optional URL of the applicant CV',
  })
  @IsString()
  @IsOptional()
  cvUrl?: string;
}
