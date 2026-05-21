import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faStar as faStarRegular, faBookmark } from '@fortawesome/free-regular-svg-icons';
import { faBookmark as faBookmarkSolid, faPlay, faDownload, faShareNodes, faStar as faStarSolid } from '@fortawesome/free-solid-svg-icons';
import { Quote, QuoteService } from '../../services/quotes.services';
import { UserService } from '../../services/user.service';

interface TimedCaption {
  start: number;
  end: number;
  text: string;
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit, OnDestroy {
  @ViewChildren('transcriptLine') transcriptLineElements?: QueryList<ElementRef<HTMLElement>>;
  readonly faBookmark = faBookmark;
  readonly faBookmarkSolid = faBookmarkSolid;
  readonly faPlay = faPlay;
  readonly faDownload = faDownload;
  readonly faShareNodes = faShareNodes;
  readonly faStarRegular = faStarRegular;
  readonly faStarSolid = faStarSolid;
  quote: Quote | null = null;
  message = '';
  ratingMessage = '';
  isSaved = false;
  userRating = 0;
  ratingSaving = false;
  isPlaying = false;
  displayDuration = '00:00';
  timedCaptions: TimedCaption[] = [];
  captionsVttUrl: string | null = null;
  transcriptVisible = false;
  transcriptExpanded = false;
  activeCaptionIndex = -1;

  hoverRating = 0;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private quoteService: QuoteService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const quoteId = this.route.snapshot.paramMap.get('id');

    if (!quoteId) {
      this.router.navigate(['/home']);
      return;
    }

    this.quoteService.getQuoteById(quoteId).subscribe({
      next: (quote) => {
        this.quote = quote;
        this.displayDuration = quote.duration;
        this.prepareTimedCaptions(quote.accessibilityText);
        this.registerView();
      },
      error: () => {}
    });

    if (this.isLoggedIn) {
      const storedUser = this.userService.getStoredUser();
      const savedQuotes = Array.isArray(storedUser?.savedQuotes) ? storedUser?.savedQuotes ?? [] : [];
      const ratedQuotes = Array.isArray(storedUser?.ratedQuotes) ? storedUser?.ratedQuotes ?? [] : [];

      this.isSaved = savedQuotes.some((savedQuote) => savedQuote?._id === quoteId);
      this.userRating = ratedQuotes.find((ratedQuote) => ratedQuote?.quoteId === quoteId)?.value || 0;
    }
  }

  ngOnDestroy(): void {
    this.revokeCaptionsVttUrl();
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  get hasTimedCaptions(): boolean {
    return this.timedCaptions.length > 0;
  }

  get hasNativeCaptions(): boolean {
    return this.quote?.mediaType === 'video' && !!this.captionsVttUrl;
  }

  get transcriptLines(): string[] {
    if (this.hasTimedCaptions) {
      return this.timedCaptions.map((caption) => `[${this.formatTranscriptTime(caption.start)}] ${caption.text}`);
    }

    return String(this.quote?.accessibilityText || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);
  }

  get hasTranscript(): boolean {
    return this.transcriptLines.length > 0;
  }

  get transcriptSyncLabel(): string {
    return this.hasTimedCaptions
      ? ''
      : 'Transcripcion disponible, pero no sincronizada porque no incluye marcas de tiempo.';
  }

  get mobileTranscriptPreview(): string {
    if (this.hasTimedCaptions && this.activeCaptionIndex >= 0) {
      return this.timedCaptions[this.activeCaptionIndex]?.text || '';
    }

    if (this.hasTimedCaptions) {
      return this.timedCaptions[0]?.text || '';
    }

    return this.transcriptLines[0] || '';
  }

  get ccButtonLabel(): string {
    return this.transcriptVisible ? 'Ocultar bloque de transcripcion' : 'Mostrar bloque de transcripcion';
  }

  startPlayback(): void {
    this.isPlaying = true;
    this.message = '';
  }

  toggleTranscript(): void {
    this.transcriptVisible = !this.transcriptVisible;

    if (!this.transcriptVisible) {
      this.transcriptExpanded = false;
    }
  }

  toggleTranscriptExpanded(): void {
    this.transcriptExpanded = !this.transcriptExpanded;
  }

  handleDownload(): void {
    if (!this.quote) {
      return;
    }

    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    this.quoteService.registerDownload(this.quote._id).subscribe({
      next: ({ mediaUrl, downloadUrl, fileName }) => {
        this.message = 'Descarga iniciada.';
        this.startBrowserDownload(downloadUrl || mediaUrl, fileName || this.buildDownloadFileName(mediaUrl));
      },
      error: () => {
        this.message = 'No se pudo registrar la descarga.';
      }
    });
  }

  toggleSave(): void {
    if (!this.quote) {
      return;
    }

    if (!this.isLoggedIn) {
      this.router.navigate(['/login']);
      return;
    }

    this.quoteService.toggleSave(this.quote._id).subscribe({
      next: ({ saved, message, savedQuoteIds }) => {
        this.isSaved = saved;
        this.message = message;
        this.userService.syncSavedQuotes(savedQuoteIds);
      },
      error: () => {
        this.message = 'No se pudo actualizar el guardado.';
      }
    });
  }

  rateQuote(value: number): void {
    if (!this.quote || this.ratingSaving) {
      return;
    }

    if (!this.isLoggedIn) {
      this.ratingMessage = 'Debes iniciar sesion para valorar esta publicacion.';
      this.router.navigate(['/login']);
      return;
    }

    this.ratingSaving = true;
    this.ratingMessage = '';

    this.quoteService.rateQuote(this.quote._id, value).subscribe({
      next: ({ rating, ratingsCount, ratedQuotes, message }) => {
        this.ratingSaving = false;
        this.userRating = value;
        this.ratingMessage = message;
        this.quote = {
          ...this.quote!,
          rating,
          ratingsCount
        };
        this.userService.syncRatedQuotes(ratedQuotes);
      },
      error: (error: HttpErrorResponse) => {
        this.ratingSaving = false;
        this.ratingMessage = error.error?.message || 'No se pudo registrar la valoracion.';
      }
    });
  }

  async shareContent(): Promise<void> {
    if (!this.quote) {
      return;
    }

    const shareUrl = `${window.location.origin}/quote/${this.quote._id}`;

    if (navigator.share) {
      await navigator.share({
        title: this.quote.workTitle,
        text: this.quote.text,
        url: shareUrl
      });
      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    this.message = 'Enlace copiado al portapapeles.';
  }

  updateDuration(event: Event): void {
    const media = event.target as HTMLMediaElement;

    if (!media?.duration || Number.isNaN(media.duration) || !Number.isFinite(media.duration)) {
      return;
    }

    this.displayDuration = this.formatDuration(media.duration);
    this.updateActiveTranscript(event);
  }

  updateActiveTranscript(event: Event): void {
    if (!this.hasTimedCaptions) {
      this.setActiveCaptionIndex(-1);
      return;
    }

    const media = event.target as HTMLMediaElement;
    const currentTime = Number.isFinite(media.currentTime) ? media.currentTime : 0;
    const activeIndex = this.timedCaptions.findIndex((caption) =>
      currentTime >= caption.start && currentTime < caption.end
    );

    this.setActiveCaptionIndex(activeIndex);
  }

  clearActiveTranscript(): void {
    this.setActiveCaptionIndex(-1);
  }

  openProfile(): void {
    this.router.navigate([this.isLoggedIn ? '/profile' : '/login']);
  }

  get ratingStars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  trackByNumber(_index: number, value: number): number {
    return value;
  }

  trackByText(_index: number, value: string): string {
    return value;
  }

  trackByCaption(_index: number, caption: TimedCaption): string {
    return `${caption.start}-${caption.text}`;
  }

  formatTimestamp(seconds: number): string {
    return this.formatTranscriptTime(seconds);
  }

  private formatDuration(durationInSeconds: number): string {
    const totalSeconds = Math.floor(durationInSeconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(seconds).padStart(2, '0');

    return `${hh}:${mm}:${ss}`;
  }

  private formatTranscriptTime(seconds: number): string {
    const totalSeconds = Math.max(0, Math.floor(seconds));
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  private prepareTimedCaptions(rawText: string): void {
    this.timedCaptions = this.parseTimedCaptions(rawText);
    this.transcriptVisible = false;
    this.transcriptExpanded = false;
    this.activeCaptionIndex = -1;
    this.revokeCaptionsVttUrl();
    this.captionsVttUrl = this.createVttUrl(this.timedCaptions);
  }

  private parseTimedCaptions(rawText: string): TimedCaption[] {
    const parsedCaptions = String(rawText || '')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => this.parseCaptionLine(line))
      .filter((caption): caption is { start: number; end?: number; text: string } => Boolean(caption))
      .sort((first, second) => first.start - second.start);

    return parsedCaptions.map((caption, index) => {
      const nextCaption = parsedCaptions[index + 1];
      const fallbackEnd = nextCaption ? nextCaption.start : caption.start + 4;
      const end = typeof caption.end === 'number' && caption.end > caption.start ? caption.end : fallbackEnd;

      return {
        start: caption.start,
        end,
        text: caption.text
      };
    });
  }

  private parseCaptionLine(line: string): { start: number; end?: number; text: string } | null {
    const timeValue = '(?:\\d{1,2}:)?\\d{1,2}:\\d{2}(?:[.,]\\d{1,3})?|\\d+(?:[.,]\\d+)?s';
    const rangeMatch = line.match(new RegExp(`^\\[?\\s*(${timeValue})\\s*(?:-->|-)\\s*(${timeValue})\\s*\\]?\\s*(.+)$`, 'i'));

    if (rangeMatch) {
      const start = this.parseTimestamp(rangeMatch[1]);
      const end = this.parseTimestamp(rangeMatch[2]);
      const text = rangeMatch[3].trim();

      return start === null || end === null || !text ? null : { start, end, text };
    }

    const startMatch = line.match(new RegExp(`^\\[?\\s*(${timeValue})\\s*\\]?\\s*[:\\-]?\\s*(.+)$`, 'i'));

    if (!startMatch) {
      return null;
    }

    const start = this.parseTimestamp(startMatch[1]);
    const text = startMatch[2].trim();

    return start === null || !text ? null : { start, text };
  }

  private parseTimestamp(value: string): number | null {
    const normalizedValue = value.trim().replace(',', '.').replace(/s$/i, '');
    const parts = normalizedValue.split(':').map((part) => Number(part));

    if (!parts.length || parts.some((part) => !Number.isFinite(part) || part < 0)) {
      return null;
    }

    if (parts.length === 3) {
      return (parts[0] * 3600) + (parts[1] * 60) + parts[2];
    }

    if (parts.length === 2) {
      return (parts[0] * 60) + parts[1];
    }

    return parts[0];
  }

  private createVttUrl(captions: TimedCaption[]): string | null {
    if (!captions.length) {
      return null;
    }

    const lines = ['WEBVTT', ''];

    captions.forEach((caption) => {
      lines.push(
        `${this.toVttTime(caption.start)} --> ${this.toVttTime(caption.end)}`,
        caption.text,
        ''
      );
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/vtt' });
    return URL.createObjectURL(blob);
  }

  private toVttTime(seconds: number): string {
    const totalMilliseconds = Math.max(0, Math.floor(seconds * 1000));
    const hours = Math.floor(totalMilliseconds / 3600000);
    const minutes = Math.floor((totalMilliseconds % 3600000) / 60000);
    const secs = Math.floor((totalMilliseconds % 60000) / 1000);
    const milliseconds = totalMilliseconds % 1000;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(milliseconds).padStart(3, '0')}`;
  }

  private startBrowserDownload(url: string, fileName: string): void {
    const link = document.createElement('a');
    link.href = new URL(url, window.location.origin).toString();
    link.download = fileName;
    link.rel = 'noopener';
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  private buildDownloadFileName(mediaUrl: string): string {
    const extensionMatch = mediaUrl.split('?')[0].match(/\.[a-z0-9]+$/i);
    const extension = extensionMatch ? extensionMatch[0] : '';
    const baseName = `${this.quote?.workTitle || 'ekko'}-${this.quote?.mediaType || 'media'}`
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[<>:"/\\|?*\x00-\x1F]+/g, '-')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || 'ekko-media';

    return extension && !baseName.endsWith(extension.toLowerCase()) ? `${baseName}${extension}` : baseName;
  }

  private registerView(): void {
    if (!this.quote) {
      return;
    }

    this.quoteService.registerView(this.quote._id).subscribe({
      next: ({ views }) => {
        if (this.quote) {
          this.quote = {
            ...this.quote,
            views
          };
        }
      }
    });
  }

  private revokeCaptionsVttUrl(): void {
    if (!this.captionsVttUrl) {
      return;
    }

    URL.revokeObjectURL(this.captionsVttUrl);
    this.captionsVttUrl = null;
  }

  private setActiveCaptionIndex(index: number): void {
    if (this.activeCaptionIndex === index) {
      return;
    }

    this.activeCaptionIndex = index;

    if (index < 0 || !this.transcriptVisible) {
      return;
    }

    requestAnimationFrame(() => {
      const targetLine = this.transcriptLineElements?.get(index)?.nativeElement;
      targetLine?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    });
  }
}
