import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  name: string = '';
  email: string = '';
  phone: string = '';
  password: string = '';
  confirmPassword: string = '';
  role: string = 'student';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  // Auto-capitalize the first letter of each word in real-time and block numbers
  onNameInput(event: any): void {
    let value = event.target.value.replace(/[0-9]/g, ''); // Strip numbers

    // Automatically capitalize the first letter of every word (handles spaces automatically)
    value = value.replace(/(^|\s)([a-z])/g, (match: string, p1: string, p2: string) => p1 + p2.toUpperCase());

    this.name = value;
  }

  // Restrict phone input to numbers only, max 10 digits, and ensure it starts with 7, 8, or 9
  onPhoneInput(event: any): void {
    let cleaned = event.target.value.replace(/\D/g, '').slice(0, 10);

    // If the user managed to input something that doesn't start with 7, 8, or 9, clear it
    if (cleaned.length > 0 && !/^[789]/.test(cleaned)) {
      cleaned = '';
    }

    this.phone = cleaned;
  }

  // Prevent invalid keys for phone number at the keyboard level (forcing 7, 8, 9 as 1st digit)
  onPhoneKeypress(event: KeyboardEvent): void {
    const char = event.key;
    if (!/^[0-9]$/.test(char)) {
      event.preventDefault();
      return;
    }
    // If this is the very first digit, it must be 7, 8, or 9
    if (this.phone.length === 0 && !/^[789]$/.test(char)) {
      event.preventDefault();
    }
  }

  onRegister(): void {
    // 1. Check empty fields
    if (!this.name || !this.email || !this.phone || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Please fill in all required fields!';
      return;
    }

    // 2. Validate Name: Must start with capital letter per word and contain no numbers
    if (/\d/.test(this.name)) {
      this.errorMessage = 'Name cannot contain numbers!';
      return;
    }
    if (!/^[A-Z]/.test(this.name)) {
      this.errorMessage = 'Name must start with a capital letter!';
      return;
    }

    // 3. Validate Phone Number: Exactly 10 digits, starting with 7, 8, or 9
    if (!/^[789]\d{9}$/.test(this.phone)) {
      this.errorMessage = 'Phone number must be 10 digits, start with 7, 8, or 9, and contain numbers only!';
      return;
    }

    // 4. Validate Email format: Compulsory @gmail.com check
    const gmailRegex = /^[^\s@]+@gmail\.com$/i;
    if (!gmailRegex.test(this.email)) {
      this.errorMessage = 'Email must be a valid @gmail.com address!';
      return;
    }

    // 5. Validate Password: Min 8 chars, letters, numbers, and symbol required
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    if (!passwordRegex.test(this.password)) {
      this.errorMessage = 'Password must be at least 8 characters long and contain letters, numbers, and a symbol!';
      return;
    }

    // 6. Password Match Check
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    const newUser = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: this.role
    };

    this.isLoading = true;
    this.errorMessage = '';

    // Call Spring Boot backend to save into MySQL database
    this.authService.register(newUser).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Registration successful! Please sign in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Registration failed:', err);
        this.errorMessage = err.error?.message || 'Registration failed. Email might already be registered in the system.';
      }
    });
  }
}