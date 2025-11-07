import { SetMetadata } from "@nestjs/common";

export const IS_PERMIT_ALL = 'isPermitAll';
export const PermitAll = () => SetMetadata(IS_PERMIT_ALL, true);

export const IS_REQUIRE_PERMISSIONS = 'requiredPermissions';
export const RequirePermissions = (...permissions: string[]) => SetMetadata(IS_REQUIRE_PERMISSIONS, permissions);
