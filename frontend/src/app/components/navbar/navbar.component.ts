import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBookmark as faBookmarkRegular,
  faCompass as faCompassRegular,
  faUser as faUserRegular
} from '@fortawesome/free-regular-svg-icons';
import {
  faBookmark as faBookmarkSolid,
  faCompass as faCompassSolid,
  faHouse as faHouseSolid,
  faPlusCircle as faPlusCircle,
  faPlus as faPlus,
  faUser as faUserSolid
} from '@fortawesome/free-solid-svg-icons';
import { faBookmark } from '@fortawesome/free-regular-svg-icons';

type NavbarTab = 'home' | 'discover' | 'publish' | 'library' | 'profile' | '';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @Input() activeTab: NavbarTab = '';
  protected readonly faHouseSolid = faHouseSolid;
  protected readonly faCompassRegular = faCompassRegular;
  protected readonly faCompassSolid = faCompassSolid;
  protected readonly faBookmarkRegular = faBookmarkRegular;
  protected readonly faBookmarkSolid = faBookmarkSolid;
  protected readonly faPlusCircle = faPlusCircle;
  protected readonly faPlus = faPlus;
  protected readonly faUserRegular = faUserRegular;
  protected readonly faUserSolid = faUserSolid;

  constructor(public router: Router) {}

  openHome(): void {
    this.router.navigate(['/home']);
  }

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

  openLibrary(): void {
    this.router.navigate([this.isLoggedIn ? '/library' : '/login']);
  }
}
