import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthenticatedRequest } from '~/core/services/token-service';

interface AuthReq extends Request, AuthenticatedRequest {}

export const CurrentUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<AuthReq>();

    if (!request.user || !request.user.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    return request.user.id;
  },
);
