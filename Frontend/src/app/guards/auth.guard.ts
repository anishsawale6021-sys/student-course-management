import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { getCookie } from '../utils/cookie.util';

export const authGuard = () => {
    const router = inject(Router);
    const isLoggedIn = getCookie('currentUserName') || getCookie('currentUserEmail');

    if (isLoggedIn) {
        return true; // Allow access if logged in
    } else {
        // Redirect to login if unauthorized
        router.navigate(['/login']);
        return false;
    }
};