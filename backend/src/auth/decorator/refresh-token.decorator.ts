import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetRefreshToken = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization;
    if (token) {
      return token.replace('Bearer ', '');
    }
    return '';
  },
);
