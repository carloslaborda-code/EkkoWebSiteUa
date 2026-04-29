import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

type NavbarTab = 'home' | 'discover' | 'publish' | 'library' | 'profile' | '';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() activeTab: NavbarTab = '';

  constructor(private router: Router) {}

  openDiscover(): void {
    this.router.navigate(['/discover']);
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  openProfile(): void {
    this.router.navigate([this.isLoggedIn ? '/profile' : '/login']);
  }

  openPublish(): void {
    this.router.navigate([this.isLoggedIn ? '/publish' : '/login']);
  }
}
