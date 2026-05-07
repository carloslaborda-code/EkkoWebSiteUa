import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CreateQuotePayload, QuoteService } from '../../services/quotes.services';
import { UserService } from '../../services/user.service';
import { faChevronLeft, faChevronRight} from '@fortawesome/free-solid-svg-icons';


type MediaType = 'audio' | 'video';
type Category = 'movie' | 'series' | 'game' | 'sfx';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent implements OnInit, OnDestroy {
  @ViewChild('videoCoverPreview') videoCoverPreview?: ElementRef<HTMLVideoElement>;

  private readonly maxAudioSize = 8 * 1024 * 1024;
  private readonly maxVideoSize = 20 * 1024 * 1024;
  private readonly maxCoverSize = 4 * 1024 * 1024;
  private readonly unknownLabel = 'Unkown';
  private framePreviewTimer?: ReturnType<typeof setTimeout>;
  private framePreviewRequestId = 0;
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
  coverFileName = '';
  selectedCoverDataUrl = '';
  generatedCoverDataUrl = '';
  videoPreviewUrl = '';
  videoDurationSeconds = 0;
  selectedCoverTimeSeconds = 0;
  capturingCover = false;
  duration = '00:00';
  submitting = false;
  message = '';

  readonly categories: Array<{ label: string; value: Category }> = [
    { label: 'Pelicula', value: 'movie' },
    { label: 'Serie', value: 'series' },
    { label: 'Videojuego', value: 'game' },
    { label: 'Efectos', value: 'sfx' }
  ];
  readonly yearOptions = this.buildYearOptions();
  readonly faChevronLeft = faChevronLeft;
  readonly faChevronRight = faChevronRight;

  constructor(private quoteService: QuoteService, private userService: UserService, public router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.clearFramePreviewTimer();
    this.revokeVideoPreviewUrl();
  }

  get acceptTypes(): string {
    return this.mediaType === 'audio' ? '.mp3,audio/*' : '.mp4,.mov,video/*';
  }

  get coverPreview(): string {
    return this.selectedCoverDataUrl || this.generatedCoverDataUrl || this.getFallbackCover();
  }

  setMediaType(type: MediaType): void {
    if (this.mediaType === type) {
      return;
    }

    this.mediaType = type;
    this.resetSelectedMedia();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const maxAllowedSize = this.mediaType === 'audio' ? this.maxAudioSize : this.maxVideoSize;
    if (file.size > maxAllowedSize) {
      this.resetSelectedMedia();
      this.message = this.mediaType === 'audio'
        ? 'El audio es demasiado pesado. Usa un archivo de hasta 8 MB.'
        : 'El video es demasiado pesado. Usa un archivo de hasta 20 MB.';
      input.value = '';
      return;
    }

    this.selectedFileName = file.name;
    this.coverFileName = '';
    this.selectedCoverDataUrl = '';
    this.generatedCoverDataUrl = '';
    this.videoDurationSeconds = 0;
    this.selectedCoverTimeSeconds = 0;
    this.message = '';

    if (this.mediaType === 'video') {
      this.revokeVideoPreviewUrl();
      this.videoPreviewUrl = URL.createObjectURL(file);
    }

    this.readFileAsDataUrl(file)
      .then((dataUrl) => {
        this.mediaDataUrl = dataUrl;
        return Promise.all([this.extractDuration(file), this.extractCoverFromMedia(file)]);
      })
      .then(([duration, coverDataUrl]) => {
        this.duration = duration;
        this.generatedCoverDataUrl = coverDataUrl;
      })
      .catch(() => {
        this.resetSelectedMedia();
        this.message = 'No se pudo procesar el archivo seleccionado.';
      });
  }

  onCoverChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > this.maxCoverSize) {
      this.coverFileName = '';
      this.selectedCoverDataUrl = '';
      this.message = 'La portada es demasiado pesada. Usa una imagen de hasta 4 MB.';
      input.value = '';
      return;
    }

    this.coverFileName = file.name;
    this.message = '';

    this.readFileAsDataUrl(file)
      .then((dataUrl) => {
        this.selectedCoverDataUrl = dataUrl;
      })
      .catch(() => {
        this.coverFileName = '';
        this.selectedCoverDataUrl = '';
        this.message = 'No se pudo procesar la portada seleccionada.';
      });
  }

  clearSelectedCover(): void {
    this.coverFileName = '';
    this.selectedCoverDataUrl = '';
  }

  onVideoPreviewLoaded(event: Event): void {
    const video = event.target as HTMLVideoElement;
    if (!Number.isFinite(video.duration) || video.duration <= 0) {
      this.videoDurationSeconds = 0;
      this.selectedCoverTimeSeconds = 0;
      return;
    }

    this.videoDurationSeconds = video.duration;
    this.selectedCoverTimeSeconds = Math.min(this.selectedCoverTimeSeconds, this.videoDurationSeconds);
    this.previewSelectedFrame();
  }

  onCoverTimeChange(): void {
    this.clearFramePreviewTimer();
    this.framePreviewTimer = setTimeout(() => {
      this.previewSelectedFrame();
    }, 120);
  }

  async captureCoverFromSelectedFrame(): Promise<void> {
    await this.previewSelectedFrame();
  }

  async previewSelectedFrame(): Promise<void> {
    const video = this.videoCoverPreview?.nativeElement;

    if (!video || !this.videoPreviewUrl) {
      this.message = 'Sube un video antes de elegir una portada desde el fragmento.';
      return;
    }

    const requestId = ++this.framePreviewRequestId;
    this.capturingCover = true;
    this.message = '';

    try {
      const dataUrl = await this.captureFrameAtTime(video, this.selectedCoverTimeSeconds);
      if (requestId !== this.framePreviewRequestId) {
        return;
      }
      this.selectedCoverDataUrl = dataUrl;
      this.coverFileName = `Frame ${this.formatTimestamp(this.selectedCoverTimeSeconds)}`;
    } catch {
      this.message = 'No se pudo capturar esa portada desde el video.';
    } finally {
      if (requestId === this.framePreviewRequestId) {
        this.capturingCover = false;
      }
    }
  }

  formatTimestamp(seconds: number): string {
    const safeSeconds = Number.isFinite(seconds) && seconds >= 0 ? Math.floor(seconds) : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  trackByCategory(_index: number, option: { value: Category }): Category {
    return option.value;
  }

  trackByYear(_index: number, year: string): string {
    return year;
  }

  publish(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.quoteText || !this.workTitle || !this.year || !this.synopsis || !this.mediaDataUrl) {
      this.message = 'Completa los campos obligatorios y sube un archivo antes de publicar.';
      return;
    }

    const parsedYear = Number(this.year);
    if (!Number.isFinite(parsedYear) || parsedYear < 0) {
      this.message = 'El ano debe ser valido.';
      return;
    }

    const image = this.resolveImage();
    if (!image) {
      this.message = 'No se pudo generar la portada del video. Elige una imagen manual.';
      return;
    }

    const actorName = this.withUnknownFallback(this.actorName);
    const characterName = this.withUnknownFallback(this.characterName);

    const payload: CreateQuotePayload = {
      text: this.quoteText.trim(),
      workTitle: this.workTitle.trim(),
      year: parsedYear,
      rating: 0,
      views: '0',
      image,
      mediaType: this.mediaType,
      mediaUrl: this.mediaDataUrl,
      duration: this.duration,
      actorName,
      characterName,
      synopsis: this.synopsis.trim(),
      hashtags: this.parseHashtags(this.hashtagsText),
      category: this.category
    };

    this.submitting = true;
    this.message = '';

    this.quoteService.createQuote(payload).subscribe({
      next: ({ quote, user }) => {
        this.submitting = false;
        this.userService.syncPublishedUpload(user);
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

  private resolveImage(): string {
    return this.selectedCoverDataUrl || this.generatedCoverDataUrl || this.getFallbackCover();
  }

  private withUnknownFallback(value: string): string {
    const normalizedValue = value.trim();
    return normalizedValue || this.unknownLabel;
  }

  private getFallbackCover(): string {
    return this.mediaType === 'audio' ? '/assets/images/audio-placeholder.webp' : '';
  }

  private captureFrameAtTime(video: HTMLVideoElement, targetTime: number): Promise<string> {
    return new Promise((resolve, reject) => {
      const handleSeeked = () => {
        video.removeEventListener('seeked', handleSeeked);

        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;

          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('No se pudo generar la portada.'));
            return;
          }

          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.9));
        } catch (error) {
          reject(error);
        }
      };

      video.addEventListener('seeked', handleSeeked, { once: true });
      video.currentTime = Math.min(Math.max(targetTime, 0), this.videoDurationSeconds || targetTime || 0);
    });
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

  private extractCoverFromMedia(file: File): Promise<string> {
    if (this.mediaType !== 'video') {
      return Promise.resolve('');
    }

    return new Promise((resolve) => {
      const objectUrl = URL.createObjectURL(file);
      const video = document.createElement('video');

      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      video.src = objectUrl;

      const cleanup = () => {
        URL.revokeObjectURL(objectUrl);
      };

      video.onloadeddata = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 1280;
          canvas.height = video.videoHeight || 720;

          const context = canvas.getContext('2d');
          if (!context) {
            cleanup();
            resolve('');
            return;
          }

          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          cleanup();
          resolve(dataUrl);
        } catch {
          cleanup();
          resolve('');
        }
      };

      video.onerror = () => {
        cleanup();
        resolve('');
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

  private resetSelectedMedia(): void {
    this.clearFramePreviewTimer();
    this.revokeVideoPreviewUrl();
    this.selectedFileName = '';
    this.mediaDataUrl = '';
    this.coverFileName = '';
    this.selectedCoverDataUrl = '';
    this.generatedCoverDataUrl = '';
    this.videoDurationSeconds = 0;
    this.selectedCoverTimeSeconds = 0;
    this.duration = '00:00';
    this.message = '';
  }

  private clearFramePreviewTimer(): void {
    if (!this.framePreviewTimer) {
      return;
    }

    clearTimeout(this.framePreviewTimer);
    this.framePreviewTimer = undefined;
  }

  private buildYearOptions(): string[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1899 }, (_, index) => String(currentYear - index));
  }

  private revokeVideoPreviewUrl(): void {
    if (!this.videoPreviewUrl) {
      return;
    }

    URL.revokeObjectURL(this.videoPreviewUrl);
    this.videoPreviewUrl = '';
  }
}
