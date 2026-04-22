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

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const data = {
      username: this.username,
      email: this.email,
      password: this.password
    };

    this.auth.register(data).subscribe({
      next: (res) => {
        console.log('Registro correcto', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error en registro', err);
        alert(err.error?.message || 'Error al registrar usuario');
      }
    });
  }
}