import { Component, Input } from '@angular/core';

export type AppIconName =
  | 'chevron-left'
  | 'play-solid'
  | 'arrow-down-tray'
  | 'share'
  | 'bookmark'
  | 'bookmark-solid'
  | 'cog-6-tooth'
  | 'pencil-square'
  | 'star'
  | 'star-solid';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html'
})
export class IconComponent {
  @Input() name: AppIconName = 'star';
  @Input() className = 'h-6 w-6';
}
