import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccessibilityService } from '../../services/accessibility.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private auth: AuthService,
    private accessibilityService: AccessibilityService,
    public router: Router
  ) {}

  login(): void {
    this.errorMessage = '';

    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Introduce tu correo o usuario y tu contrasena.';
      return;
    }

    this.isSubmitting = true;

    const data = {
      email: this.email,
      password: this.password
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
        this.errorMessage = err.error?.message || 'No se pudo iniciar sesion. Revisa que el backend este arrancado.';
      }
    });
  }
}
