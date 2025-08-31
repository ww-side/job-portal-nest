import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

export function DeleteUserDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete current user' }),
    ApiResponse({ status: 200, description: 'User successfully deleted' }),
  );
}

export function UpdateUserDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update user data' }),
    ApiResponse({ status: 200, description: 'User successfully updated' }),
  );
}

export function CreateUserDoc() {
  return applyDecorators(
    ApiOperation({ summary: 'Create a new user' }),
    ApiResponse({ status: 201, description: 'User successfully created' }),
  );
}
