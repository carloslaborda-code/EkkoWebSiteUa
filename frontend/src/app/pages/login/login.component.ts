import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccessibilityService } from '../../services/accessibility.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  errorMessage = '';
  isSubmitting = false;
  hasSubmitted = false;

  constructor(
    private auth: AuthService,
    private accessibilityService: AccessibilityService,
    public router: Router
  ) { }

  validate(showIncompleteError = false): boolean {
    const error = this.getValidationError(showIncompleteError);
    this.errorMessage = error;
    return !error;
  }

  private getValidationError(showIncompleteError: boolean): string {
    const emailOrUsername = this.email.trim();
    const password = this.password.trim();

    const hasAnyValue = emailOrUsername || password;

    if (!hasAnyValue) {
      return '';
    }

    if (!emailOrUsername || !password) {
      return showIncompleteError ? 'Introduce tu correo o usuario y tu contraseña.' : '';
    }

    const isEmail = emailOrUsername.includes('@');

    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(emailOrUsername)) {
        return 'Por favor, introduce un correo electrónico válido.';
      }
    } else {
      const usernameRegex = /^[a-zA-Z0-9_]+$/;

      if (!usernameRegex.test(emailOrUsername)) {
        return 'El nombre de usuario solo puede contener letras, números y guiones bajos.';
      }

      if (emailOrUsername.length < 5 || emailOrUsername.length > 50) {
        return 'El nombre de usuario debe tener entre 5 y 50 caracteres.';
      }
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

    return '';
  }

  login(): void {
    this.hasSubmitted = true;
    this.errorMessage = '';

    if (!this.validate(true)) {
      return;
    }

    this.isSubmitting = true;

    const data = {
      email: this.email.trim(),
      password: this.password.trim()
    };

    this.auth.login(data).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));

        if (res.user.settings) {
          this.accessibilityService.persistUserSettings(res.user.settings);
        }

        this.isSubmitting = false;
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        this.isSubmitting = false;
        this.errorMessage =
          err.error?.message ||
          'No se pudo iniciar sesión. Revisa que el backend esté arrancado.';
      }
    });
  }
}