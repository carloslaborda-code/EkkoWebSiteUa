import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserProfile, UserService, UserUpload } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  avatarSaving = false;
  avatarMessage = '';
  avatarError = false;

  constructor(private userService: UserService, public router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getCurrentUser().subscribe({
      next: (profile) => {
        this.profile = profile;
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  get initials(): string {
    if (!this.profile?.username) {
      return 'EK';
    }

    return this.profile.username
      .split(' ')
      .map((chunk) => chunk[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  onAvatarChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.avatarError = true;
      this.avatarMessage = 'Selecciona una imagen valida para el perfil.';
      input.value = '';
      return;
    }

    this.avatarSaving = true;
    this.avatarError = false;
    this.avatarMessage = 'Actualizando foto de perfil...';

    const reader = new FileReader();

    reader.onload = () => {
      const avatar = typeof reader.result === 'string' ? reader.result : '';

      if (!avatar) {
        this.avatarSaving = false;
        this.avatarError = true;
        this.avatarMessage = 'No se pudo leer la imagen seleccionada.';
        input.value = '';
        return;
      }

      this.userService.updateProfile({ avatar }).subscribe({
        next: ({ user }) => {
          this.profile = user;
          this.avatarSaving = false;
          this.avatarError = false;
          this.avatarMessage = 'Foto de perfil actualizada correctamente.';
          input.value = '';
        },
        error: () => {
          this.avatarSaving = false;
          this.avatarError = true;
          this.avatarMessage = 'No se pudo actualizar la foto de perfil.';
          input.value = '';
        }
      });
    };

    reader.onerror = () => {
      this.avatarSaving = false;
      this.avatarError = true;
      this.avatarMessage = 'No se pudo leer la imagen seleccionada.';
      input.value = '';
    };

    reader.readAsDataURL(file);
  }

  trackByUpload(index: number, upload: UserUpload): string {
    return upload.quoteId || `${upload.title}-${index}`;
  }
}
