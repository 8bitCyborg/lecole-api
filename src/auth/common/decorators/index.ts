import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetCurrentUser = createParamDecorator(
  (data: string | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (!data) return request.user;
    return request.user[data];
  },
);

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    return request.user['sub'];
  },
);

export const GetCurrentSchoolId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string | null => {
    const request = context.switchToHttp().getRequest();
    return request.user['schoolId'];
  },
);

import { SetMetadata } from '@nestjs/common';

export const Public = () => SetMetadata('isPublic', true);
