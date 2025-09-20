import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

import { LoginDTO, RefreshTokenDTO } from './dto';

export function LoginDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'User login' }),
    ApiBody({ type: LoginDTO }),
    ApiResponse({
      status: 200,
      description: 'Login successful, returns tokens',
    }),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
  );
}

export function RefreshTokenDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Refresh access token' }),
    ApiBody({ type: RefreshTokenDTO }),
    ApiResponse({ status: 200, description: 'Access token refreshed' }),
    ApiResponse({ status: 401, description: 'Invalid refresh token' }),
  );
}

export function LogoutDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Logout user' }),
    ApiResponse({ status: 200, description: 'Logout successful' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
