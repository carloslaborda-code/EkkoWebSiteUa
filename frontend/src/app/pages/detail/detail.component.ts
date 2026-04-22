import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Quote, QuoteService } from '../../services/quotes.services';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  quote: Quote | null = null;
  loading = true;
  message = '';
  isSaved = false;
  isPlaying = false;
  displayDuration = '00:00';

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
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });

    if (this.isLoggedIn) {
      this.userService.getCurrentUser().subscribe({
        next: (profile) => {
          this.isSaved = profile.savedQuotes.some((savedQuote) => savedQuote._id === quoteId);
        }
      });
    }
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  startPlayback(): void {
    this.isPlaying = true;
    this.message = '';
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
      next: ({ mediaUrl }) => {
        this.message = '';
        const link = document.createElement('a');
        link.href = mediaUrl;
        link.download = `${this.quote?.workTitle}-${this.quote?.mediaType}`;
        link.click();
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

  openProfile(): void {
    this.router.navigate([this.isLoggedIn ? '/profile' : '/login']);
  }
}
