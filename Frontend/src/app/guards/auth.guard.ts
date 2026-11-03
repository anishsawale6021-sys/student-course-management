import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
    const router = inject(Router);
    const isLoggedIn = sessionStorage.getItem('currentUserName') || sessionStorage.getItem('currentUserEmail');

    if (isLoggedIn) {
        return true; // Allow access if logged in
    } else {
        // Redirect to login if unauthorized
        router.navigate(['/login']);
        return false;
    }
};