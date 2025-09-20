import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';

import { CreateCompanyDTO, UpdateCompanyDTO } from './dto';

export function CreateCompanyDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Create a new company' }),
    ApiBody({ type: CreateCompanyDTO }),
    ApiResponse({ status: 201, description: 'Company successfully created' }),
    ApiResponse({ status: 400, description: 'Validation failed' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function UpdateCompanyDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Update company data' }),
    ApiParam({ name: 'id', required: true, description: 'Company ID' }),
    ApiBody({ type: UpdateCompanyDTO }),
    ApiResponse({ status: 200, description: 'Company successfully updated' }),
    ApiResponse({ status: 400, description: 'Validation failed' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Company not found' }),
  );
}

export function DeleteCompanyDoc() {
  return applyDecorators(
    ApiBearerAuth(),
    ApiOperation({ summary: 'Delete a company' }),
    ApiParam({ name: 'id', required: true, description: 'Company ID' }),
    ApiResponse({ status: 200, description: 'Company successfully deleted' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Company not found' }),
  );
}
