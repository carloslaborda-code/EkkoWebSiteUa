import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faFloppyDisk, faMagnifyingGlass, faShieldHalved, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Quote, QuoteService } from '../../services/quotes.services';
import { UserService } from '../../services/user.service';

interface AdminQuote extends Quote {
  draftAccessibilityText: string;
  saving: boolean;
  deleting: boolean;
  statusMessage: string;
  statusError: boolean;
  currentPreviewTime: number;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  quotes: AdminQuote[] = [];
  visibleQuotes: AdminQuote[] = [];
  searchTerm = '';
  loading = true;
  message = '';
  isAdmin = false;
  readonly faFloppyDisk = faFloppyDisk;
  readonly faMagnifyingGlass = faMagnifyingGlass;
  readonly faShieldHalved = faShieldHalved;
  readonly faTrash = faTrash;

  constructor(
    private quoteService: QuoteService,
    private userService: UserService,
    public router: Router
  ) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getCurrentUser().subscribe({
      next: (profile) => {
        if (profile.role !== 'admin') {
          this.router.navigate(['/home']);
          return;
        }

        this.isAdmin = true;
        this.loadQuotes();
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  get totalQuotes(): number {
    return this.quotes.length;
  }

  get transcribedQuotes(): number {
    return this.quotes.filter((quote) => quote.accessibilityText.trim()).length;
  }

  applyFilters(): void {
    const normalizedSearch = this.normalizeSearchText(this.searchTerm);

    this.visibleQuotes = this.quotes.filter((quote) => {
      if (!normalizedSearch) {
        return true;
      }

      return this.normalizeSearchText([
        quote.text,
        quote.workTitle,
        quote.actorName,
        quote.characterName,
        quote.accessibilityText,
        quote.category,
        ...quote.hashtags
      ].join(' ')).includes(normalizedSearch);
    });
  }

  saveAccessibilityText(quote: AdminQuote): void {
    if (quote.saving || quote.deleting) {
      return;
    }

    quote.saving = true;
    quote.statusMessage = '';
    quote.statusError = false;

    this.quoteService.updateQuoteAccessibility(quote._id, quote.draftAccessibilityText).subscribe({
      next: ({ message, quote: updatedQuote }) => {
        quote.saving = false;
        quote.accessibilityText = updatedQuote.accessibilityText;
        quote.draftAccessibilityText = updatedQuote.accessibilityText;
        quote.statusMessage = message;
        quote.statusError = false;
        this.applyFilters();
      },
      error: (error) => {
        quote.saving = false;
        quote.statusMessage = error?.error?.message || 'No se pudo actualizar la transcripcion.';
        quote.statusError = true;
      }
    });
  }

  clearAccessibilityText(quote: AdminQuote): void {
    quote.draftAccessibilityText = '';
    this.saveAccessibilityText(quote);
  }

  deleteQuote(quote: AdminQuote): void {
    if (quote.saving || quote.deleting) {
      return;
    }

    const confirmed = window.confirm(`Eliminar "${quote.text}" de ${quote.workTitle}?`);

    if (!confirmed) {
      return;
    }

    quote.deleting = true;
    quote.statusMessage = '';
    quote.statusError = false;

    this.quoteService.deleteQuote(quote._id).subscribe({
      next: ({ message }) => {
        this.quotes = this.quotes.filter((item) => item._id !== quote._id);
        this.message = message;
        this.applyFilters();
      },
      error: (error) => {
        quote.deleting = false;
        quote.statusMessage = error?.error?.message || 'No se pudo eliminar la publicacion.';
        quote.statusError = true;
      }
    });
  }

  trackByQuoteId(_index: number, quote: AdminQuote): string {
    return quote._id;
  }

  updatePreviewTime(event: Event, quote: AdminQuote): void {
    const media = event.target as HTMLMediaElement;
    quote.currentPreviewTime = Number.isFinite(media.currentTime) ? media.currentTime : 0;
  }

  insertTimestamp(quote: AdminQuote): void {
    const timestamp = `[${this.formatTimestamp(quote.currentPreviewTime)}] `;
    const currentText = quote.draftAccessibilityText.trimEnd();
    quote.draftAccessibilityText = currentText ? `${currentText}\n${timestamp}` : timestamp;
  }

  formatTimestamp(seconds: number): string {
    const safeSeconds = Number.isFinite(seconds) && seconds >= 0 ? Math.floor(seconds) : 0;
    const minutes = Math.floor(safeSeconds / 60);
    const remainingSeconds = safeSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  private loadQuotes(): void {
    this.quoteService.getQuotes().subscribe({
      next: (quotes) => {
        this.quotes = quotes.map((quote) => this.toAdminQuote(quote));
        this.loading = false;
        this.applyFilters();
      },
      error: () => {
        this.quotes = [];
        this.visibleQuotes = [];
        this.loading = false;
        this.message = 'No se pudieron cargar las publicaciones.';
      }
    });
  }

  private toAdminQuote(quote: Quote): AdminQuote {
    return {
      ...quote,
      draftAccessibilityText: quote.accessibilityText || '',
      saving: false,
      deleting: false,
      statusMessage: '',
      statusError: false,
      currentPreviewTime: 0
    };
  }

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }
}
