import { inject } from '@angular/core';
import {
  CanActivateFn,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../services/login.service';

export const canActivateAdminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(LoginService);
  const toastrService = inject(ToastrService);

  if (
    authService.loginDisplay &&
    authService.UserRoles.filter((f) => f === 'Admin').length > 0
  ) {
    return true;
  } else if (
    authService.isLoggedIn &&
    authService.UserRoles.filter((f) => f === 'Admin').length === 0
  ) {
    toastrService.error(
      'You do not have access to Admin Module',
      'Access Denied'
    );
    inject(Router).navigate(['/home']); // Use inject(Router) to get the Router service
    return false;
  } else {
    inject(Router).navigate(['/login']); //This triggers ad b2c login flow.
    return false;
  }
};