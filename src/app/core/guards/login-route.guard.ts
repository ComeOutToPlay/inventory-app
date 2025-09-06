import { inject } from '@angular/core';
import { CanActivateFn,  Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginRouteGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  var logged = authService.isLogged();

  if (!logged)
  {
    // User is not at login page
    if (state.url.indexOf('/login') < 0)
    {
        // You want to go to a path different from /login
        var queryParams = { queryParams: { returnUrl: state.url }};
       
        if (state.url== '/')
        {
          router.navigate(['/login']);
        }
        else
        {
          // not logged in so redirect to login page with the return url
          router.navigate(['/login'], queryParams);
        }
        return true;
    }
    else if (state.url.indexOf('/login') >= 0)
    {
      // User not logged, but he/she is in the login
      return true;
    }
  }

  return logged;
};
