import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { setCookie } from '../../utils/cookie.util';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  onLogin(): void {
    if (!this.email || !this.password) {
      void Swal.fire({ icon: 'error', title: 'Missing information', text: 'Please enter your email and password!' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      void Swal.fire({ icon: 'error', title: 'Invalid email', text: 'Please enter a valid email address!' });
      return;
    }

    this.isLoading = true;

    const credentials = {
      email: this.email,
      password: this.password
    };

    this.authService.login(credentials).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        const user = response.user || response;
        const token = response.token;
        const assignedRole = (user.role || '').toLowerCase();

        if (token) {
          setCookie('authToken', token);
        }
        setCookie('currentUserEmail', user.email || this.email);
        setCookie('currentUserName', user.name || 'User');
        setCookie('currentUserRole', assignedRole);

        if (user.phone && /^\d+$/.test(user.phone)) {
          setCookie('currentUserPhone', user.phone);
        } else {
          setCookie('currentUserPhone', '');
        }

        setCookie('currentUser', JSON.stringify(user));

        const destination = assignedRole === 'admin' || assignedRole.includes('instructor')
          ? '/admin-dashboard'
          : '/student-dashboard';
        void Swal.fire({ icon: 'success', title: 'Welcome back!', text: 'You have signed in successfully.' })
          .then(() => this.router.navigate([destination]));
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login failed:', err);
        void Swal.fire({
          icon: 'error',
          title: 'Login failed',
          text: err.error?.message || 'Invalid email or password. Please check your credentials.'
        });
      }
    });
  }
}