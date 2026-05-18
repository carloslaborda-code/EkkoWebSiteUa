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

  login(): void {
    this.hasSubmitted = true;
    this.errorMessage = '';

    if (!this.validate(true)) {
      return;
    }

    this.isSubmitting = true;

    this.auth
      .login({
        email: this.email.trim(),
        password: this.password
      })
      .subscribe({
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
            'No se pudo iniciar sesion. Revisa que el backend este arrancado.';
        }
      });
  }

  get hasEmailError(): boolean {
    return !!this.errorMessage && (
      this.errorMessage.includes('correo') ||
      this.errorMessage.includes('usuario')
    );
  }

  get hasPasswordError(): boolean {
    return !!this.errorMessage && (
      this.errorMessage.includes('contrasena') ||
      this.errorMessage.includes('contraseña')
    );
  }

  private getValidationError(showIncompleteError: boolean): string {
    const emailOrUsername = this.email.trim();
    const hasAnyValue = emailOrUsername || this.password;

    if (!hasAnyValue) {
      return '';
    }

    if (!emailOrUsername || !this.password) {
      return showIncompleteError ? 'Introduce tu correo o usuario y tu contrasena.' : '';
    }

    if (emailOrUsername.includes('@')) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(emailOrUsername) ? '' : 'Introduce un correo electronico valido.';
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (!usernameRegex.test(emailOrUsername)) {
      return 'El nombre de usuario solo puede contener letras, numeros y guiones bajos.';
    }

    return '';
  }
}
