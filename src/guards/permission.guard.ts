import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
    const userContext = context.switchToHttp().getRequest();

    if (!userContext) {
      return true;
    }
    const user = userContext.user;

    const userRole = await this.userService.getRolesByUserId(user.id);
    if (!userRole || userRole.length === 0) {
      throw new UnauthorizedException('User has no permissions');
    }

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>('requiredPermissions', [context.getHandler(), context.getClass()]);

    const hasPermission = userRole.some(role => 
      role.permissions && role.permissions.some(permission => 
        requiredPermissions.includes(permission.name)
      )
    );

    return hasPermission;
  }
}
