import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  usernameAvailable: boolean | null = null;
  emailAvailable: boolean | null = null;

  private usernameTimeout: any;
  private emailTimeout: any;

  errorMessage = '';
  isSubmitting = false;
  hasSubmitted = false;

  constructor(private auth: AuthService, public router: Router) { }

  checkUsernameAvailability(): void {
    clearTimeout(this.usernameTimeout);

    const username = this.username.trim();

    // Validación previa (evita peticiones inútiles)
    if (username.length < 5 || !/^[a-zA-Z0-9_]+$/.test(username)) {
      this.usernameAvailable = null;
      return;
    }

    this.usernameTimeout = setTimeout(() => {
      this.auth.checkUsernameAvailable(username).subscribe(res => {
        this.usernameAvailable = res.available;

        if (!res.available) {
          this.errorMessage = 'El nombre de usuario ya está en uso.';
        } else if (this.errorMessage === 'El nombre de usuario ya está en uso.') {
          this.errorMessage = '';
        }
      });
    }, 400);
  }

  checkEmailAvailability(): void {
    clearTimeout(this.emailTimeout);

    const email = this.email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      this.emailAvailable = null;
      return;
    }

    this.emailTimeout = setTimeout(() => {
      this.auth.checkEmailAvailable(email).subscribe(res => {
        this.emailAvailable = res.available;

        if (!res.available) {
          this.errorMessage = 'El correo electrónico ya está en uso.';
        } else if (this.errorMessage === 'El correo electrónico ya está en uso.') {
          this.errorMessage = '';
        }
      });
    }, 400);
  }

  validate(showIncompleteError = false): boolean {
    const error = this.getValidationError(showIncompleteError);
    this.errorMessage = error;
    return !error;
  }

  private getValidationError(showIncompleteError: boolean): string {
    const username = this.username.trim();
    const email = this.email.trim();
    const password = this.password.trim();
    const confirmPassword = this.confirmPassword.trim();

    const hasAnyValue = username || email || password || confirmPassword;

    if (!hasAnyValue) {
      return '';
    }

    if (!username || !email || !password || !confirmPassword) {
      return showIncompleteError ? 'Por favor, completa todos los campos.' : '';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return 'Por favor, introduce un correo electrónico válido.';
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (!usernameRegex.test(username)) {
      return 'El nombre de usuario solo puede contener letras, números y guiones bajos.';
    }

    if (username.length < 5 || username.length > 50) {
      return 'El nombre de usuario debe tener entre 5 y 50 caracteres.';
    }

    const passwordAllowedCharsRegex = /^[a-zA-Z0-9!@#$%^&*()_\-+=.[\]{};:'",.<>/?\\|`~]+$/;

    if (!passwordAllowedCharsRegex.test(password)) {
      return 'La contraseña contiene caracteres no permitidos.';
    }

    if (password.length < 8 || password.length > 30) {
      return 'La contraseña debe tener entre 8 y 30 caracteres.';
    }

    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra minúscula.';
    }

    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe contener al menos una letra mayúscula.';
    }

    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe contener al menos un número.';
    }

    if (password !== confirmPassword) {
      return 'Las contraseñas no coinciden.';
    }

    return '';
  }

  register(): void {
    this.hasSubmitted = true;
    this.errorMessage = '';

    if (!this.validate(true)) {
      return;
    }

    this.isSubmitting = true;

    const data = {
      username: this.username.trim(),
      email: this.email.trim(),
      password: this.password.trim()
    };

    this.auth.register(data).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.errorMessage = err.error?.message || 'Error al registrar el usuario.';
      }
    });
  }
}