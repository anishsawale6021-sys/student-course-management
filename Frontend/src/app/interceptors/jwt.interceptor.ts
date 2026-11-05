import { HttpInterceptorFn } from '@angular/common/http';
import { getCookie } from '../utils/cookie.util';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const token = getCookie('authToken');

    if (token) {
        const cloned = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
        return next(cloned);
    }

    return next(req);
};