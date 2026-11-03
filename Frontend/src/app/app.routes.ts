import { Routes } from '@angular/router';
import { Landing } from './component/landing/landing';
import { LoginComponent } from './component/login/login';
import { Register } from './component/register/register';
import { StudentDashboardComponent } from './component/student-dashboard/student-dashboard';
import { AdminDashboardComponent } from './component/admin-dashboard/admin-dashboard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', component: Landing },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: Register },
    { path: 'student-dashboard', component: StudentDashboardComponent, canActivate: [authGuard] },
    { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' }
];