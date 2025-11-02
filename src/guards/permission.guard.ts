import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private readonly userService: UserService;

  @Inject(Reflector)
  private readonly reflector: Reflector;

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const userContext = context.switchToHttp().getRequest().user;

    if (!userContext) {
      throw new UnauthorizedException('User not found in request');
    }

    const existingUser = await this.userService.getUserPermissionsByEmail(userContext.email);

    if (!existingUser) {
      throw new UnauthorizedException('User doesn\'t have permissions');
    }

    if (!existingUser.permissions || existingUser.permissions.length === 0) {
      throw new UnauthorizedException('User has no permissions');
    }

    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler()) || [];

    if (!requiredPermissions || requiredPermissions.length === 0) {
      throw new UnauthorizedException('No permissions required for this route');
    }

    if (!existingUser.permissions.some(permission => requiredPermissions.includes(permission.name))) {
      throw new UnauthorizedException('User doesn\'t have required permissions');
    }

    return true;
  }
}
