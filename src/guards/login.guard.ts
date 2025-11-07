import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { IS_PERMIT_ALL } from 'src/common/custom-decorator';

@Injectable()
export class LoginGuard implements CanActivate {

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @Inject()
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPermitAll = this.reflector.getAllAndOverride(IS_PERMIT_ALL, [context.getHandler(), context.getClass()]);

    if (isPermitAll) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const authorization = request.headers['authorization'];
    if (!authorization) {
      throw new UnauthorizedException('No authorization header found');
    }

    const token = authorization.split(' ')[1];
    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
