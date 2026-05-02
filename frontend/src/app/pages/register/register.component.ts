import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnDestroy {
  username = '';
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = '';
  isSubmitting = false;
  hasSubmitted = false;
  usernameAvailable: boolean | null = null;
  emailAvailable: boolean | null = null;

  private usernameTimeout?: ReturnType<typeof setTimeout>;
  private emailTimeout?: ReturnType<typeof setTimeout>;

  constructor(private auth: AuthService, public router: Router) { }

  ngOnDestroy(): void {
    this.clearUsernameTimeout();
    this.clearEmailTimeout();
  }

  checkUsernameAvailability(): void {
    this.clearUsernameTimeout();
    this.usernameAvailable = null;

    const username = this.username.trim();

    if (!username || !this.isUsernameShapeValid(username)) {
      return;
    }

    this.usernameTimeout = setTimeout(() => {
      this.auth.checkUsernameAvailable(username).subscribe({
        next: ({ available }) => {
          this.usernameAvailable = available;

          if (!available) {
            this.errorMessage = 'El nombre de usuario ya esta en uso.';
          } else if (this.errorMessage === 'El nombre de usuario ya esta en uso.') {
            this.errorMessage = '';
          }
        },
        error: () => {
          this.usernameAvailable = null;
        }
      });
    }, 400);
  }

  checkEmailAvailability(): void {
    this.clearEmailTimeout();
    this.emailAvailable = null;

    const email = this.email.trim();

    if (!email || !this.isEmailShapeValid(email)) {
      return;
    }

    this.emailTimeout = setTimeout(() => {
      this.auth.checkEmailAvailable(email).subscribe({
        next: ({ available }) => {
          this.emailAvailable = available;

          if (!available) {
            this.errorMessage = 'El correo electronico ya esta en uso.';
          } else if (this.errorMessage === 'El correo electronico ya esta en uso.') {
            this.errorMessage = '';
          }
        },
        error: () => {
          this.emailAvailable = null;
        }
      });
    }, 400);
  }

  validate(showIncompleteError = false): boolean {
    const error = this.getValidationError(showIncompleteError);
    this.errorMessage = error;
    return !error;
  }

  register(): void {
    this.hasSubmitted = true;
    this.errorMessage = '';

    if (!this.validate(true)) {
      return;
    }

    this.isSubmitting = true;

    this.auth
      .register({
        username: this.username.trim(),
        email: this.email.trim(),
        password: this.password
      })
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/login']);
        },
        error: (err: HttpErrorResponse) => {
          this.isSubmitting = false;
          this.errorMessage = err.error?.message || 'No se pudo registrar el usuario.';
        }
      });
  }

  private getValidationError(showIncompleteError: boolean): string {
    const username = this.username.trim();
    const email = this.email.trim();
    const hasAnyValue = username || email || this.password || this.confirmPassword;

    if (!hasAnyValue) {
      return '';
    }

    if (!username || !email || !this.password || !this.confirmPassword) {
      return showIncompleteError ? 'Completa todos los campos para crear tu cuenta.' : '';
    }

    if (!this.isUsernameShapeValid(username)) {
      return 'El nombre de usuario solo puede contener letras, numeros y guiones bajos.';
    }

    if (!this.isEmailShapeValid(email)) {
      return 'Introduce un correo electronico valido.';
    }

    if (this.password.length < 6) {
      return 'La contrasena debe tener al menos 6 caracteres.';
    }

    if (this.password !== this.confirmPassword) {
      return 'Las contrasenas no coinciden.';
    }

    if (this.usernameAvailable === false) {
      return 'El nombre de usuario ya esta en uso.';
    }

    if (this.emailAvailable === false) {
      return 'El correo electronico ya esta en uso.';
    }

    return '';
  }

  private isUsernameShapeValid(username: string): boolean {
    return /^[a-zA-Z0-9_]+$/.test(username);
  }

  private isEmailShapeValid(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private clearUsernameTimeout(): void {
    if (!this.usernameTimeout) {
      return;
    }

    clearTimeout(this.usernameTimeout);
    this.usernameTimeout = undefined;
  }

  private clearEmailTimeout(): void {
    if (!this.emailTimeout) {
      return;
    }

    clearTimeout(this.emailTimeout);
    this.emailTimeout = undefined;
  }
}
