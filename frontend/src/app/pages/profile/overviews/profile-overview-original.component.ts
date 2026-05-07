import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { UserProfile } from '../../../services/user.service';

@Component({
  selector: 'app-profile-overview-original',
  templateUrl: './profile-overview-original.component.html',
  styleUrls: ['./profile-overview.shared.css', './profile-overview-original.component.css']
})
export class ProfileOverviewOriginalComponent {
  @Input() profile!: UserProfile;
  @Input() initials = '';
  @Input() avatarSaving = false;
  @Input() avatarMessage = '';
  @Input() avatarError = false;
  @Output() avatarSelected = new EventEmitter<Event>();

  readonly faPencil = faPencil;
}
