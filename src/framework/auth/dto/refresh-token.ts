import { IsNotEmpty, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RefreshTokenDTO {
  @ApiProperty({
    description: 'Refresh token to get new access token',
    example: 'dGhpc2lzYXJlZnJlc2h0b2tlbg==',
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}
