import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

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
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  onLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter your email and password!';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address!';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

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
          sessionStorage.setItem('authToken', token);
        }
        sessionStorage.setItem('currentUserEmail', user.email || this.email);
        sessionStorage.setItem('currentUserName', user.name || 'User');
        sessionStorage.setItem('currentUserRole', assignedRole);

        if (user.phone && /^\d+$/.test(user.phone)) {
          sessionStorage.setItem('currentUserPhone', user.phone);
        } else {
          sessionStorage.setItem('currentUserPhone', '');
        }

        sessionStorage.setItem('currentUser', JSON.stringify(user));

        if (assignedRole === 'admin' || assignedRole.includes('instructor')) {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/student-dashboard']);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Login failed:', err);
        this.errorMessage = err.error?.message || 'Invalid email or password. Please check your credentials.';
      }
    });
  }
}