import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateQuotePayload, QuoteService } from '../../services/quotes.services';

type MediaType = 'audio' | 'video';
type Category = 'movie' | 'series' | 'game' | 'sfx';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit {
  mediaType: MediaType = 'audio';
  category: Category = 'movie';
  quoteText = '';
  workTitle = '';
  year = '';
  actorName = '';
  characterName = '';
  synopsis = '';
  hashtagsText = '';
  selectedFileName = '';
  mediaDataUrl = '';
  duration = '00:00';
  submitting = false;
  message = '';

  readonly categories: Array<{ label: string; value: Category }> = [
    { label: 'Movie', value: 'movie' },
    { label: 'Series', value: 'series' },
    { label: 'Game', value: 'game' },
    { label: 'SFX', value: 'sfx' }
  ];

  constructor(private quoteService: QuoteService, public router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
  }

  get acceptTypes(): string {
    return this.mediaType === 'audio' ? '.mp3,audio/*' : '.mp4,.mov,video/*';
  }

  setMediaType(type: MediaType): void {
    if (this.mediaType === type) {
      return;
    }

    this.mediaType = type;
    this.selectedFileName = '';
    this.mediaDataUrl = '';
    this.duration = '00:00';
    this.message = '';
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    this.selectedFileName = file.name;
    this.message = '';

    this.readFileAsDataUrl(file)
      .then((dataUrl) => {
        this.mediaDataUrl = dataUrl;
        return this.extractDuration(file);
      })
      .then((duration) => {
        this.duration = duration;
      })
      .catch(() => {
        this.mediaDataUrl = '';
        this.duration = '00:00';
        this.message = 'No se pudo procesar el archivo seleccionado.';
      });
  }

  publish(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.quoteText || !this.workTitle || !this.year || !this.actorName || !this.characterName || !this.synopsis || !this.mediaDataUrl) {
      this.message = 'Completa todos los campos y sube un archivo antes de publicar.';
      return;
    }

    const parsedYear = Number(this.year);
    if (!Number.isFinite(parsedYear)) {
      this.message = 'El año debe ser un número válido.';
      return;
    }

    const payload: CreateQuotePayload = {
      text: this.quoteText.trim(),
      workTitle: this.workTitle.trim(),
      year: parsedYear,
      rating: 0,
      views: '0',
      image: this.mediaType === 'audio' ? '/assets/images/audio-placeholder.webp' : '/assets/images/scarface.jpg',
      mediaType: this.mediaType,
      mediaUrl: this.mediaDataUrl,
      duration: this.duration,
      actorName: this.actorName.trim(),
      characterName: this.characterName.trim(),
      synopsis: this.synopsis.trim(),
      hashtags: this.parseHashtags(this.hashtagsText),
      category: this.category
    };

    this.submitting = true;
    this.message = '';

    this.quoteService.createQuote(payload).subscribe({
      next: ({ quote }) => {
        this.submitting = false;
        this.router.navigate(['/quote', quote._id]);
      },
      error: () => {
        this.submitting = false;
        this.message = 'No se pudo publicar el contenido.';
      }
    });
  }

  private parseHashtags(raw: string): string[] {
    return raw
      .split(',')
      .map((tag) => tag.trim().replace(/^#/, ''))
      .filter(Boolean);
  }

  private readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
          return;
        }

        reject(new Error('No se pudo leer el archivo.'));
      };

      reader.onerror = () => reject(reader.error || new Error('Error al leer el archivo.'));
      reader.readAsDataURL(file);
    });
  }

  private extractDuration(file: File): Promise<string> {
    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);
      const media = document.createElement(this.mediaType === 'audio' ? 'audio' : 'video');

      media.preload = 'metadata';
      media.src = objectUrl;

      media.onloadedmetadata = () => {
        const duration = Number.isFinite(media.duration) ? this.formatDuration(media.duration) : '00:00';
        URL.revokeObjectURL(objectUrl);
        resolve(duration);
      };

      media.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve('00:00');
      };
    });
  }

  private formatDuration(durationInSeconds: number): string {
    const totalSeconds = Math.floor(durationInSeconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
  }
}
