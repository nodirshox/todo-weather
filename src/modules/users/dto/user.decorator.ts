import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface IUser {
  id: string;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IUser => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
