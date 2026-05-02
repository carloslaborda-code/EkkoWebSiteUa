import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Quote, QuoteService } from '../../services/quotes.services';

type DiscoverCategory = 'movie' | 'series' | 'game' | 'sfx';
type DiscoverFormat = 'video' | 'audio';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
  allQuotes: Quote[] = [];
  filteredQuotes: Quote[] = [];
  searchTerm = '';
  selectedCategory: DiscoverCategory = 'movie';
  selectedFormat: DiscoverFormat = 'video';
  selectedWorkTitle = '';
  loading = true;
  dropdownOpen = false;

  readonly categoryOptions: Array<{ label: string; value: DiscoverCategory; icon: 'film' | 'tv' | 'gamepad' | 'speaker-wave' }> = [
    { label: 'Pelicula', value: 'movie', icon: 'film' },
    { label: 'Serie', value: 'series', icon: 'tv' },
    { label: 'Videojuego', value: 'game', icon: 'gamepad' },
    { label: 'Efectos', value: 'sfx', icon: 'speaker-wave' }
  ];

  constructor(private quoteService: QuoteService, public router: Router) {}

  ngOnInit(): void {
    this.quoteService.getQuotes().subscribe({
      next: (quotes) => {
        this.allQuotes = quotes;
        this.loading = false;
        this.ensureValidWorkTitle();
        this.applyFilters();
      },
      error: () => {
        this.allQuotes = [];
        this.filteredQuotes = [];
        this.loading = false;
      }
    });
  }

  get visibleCategoryOptions(): Array<{ label: string; value: DiscoverCategory; icon: 'film' | 'tv' | 'gamepad' | 'speaker-wave' }> {
    return this.categoryOptions.filter((option) =>
      this.allQuotes.some((quote) => quote.category === option.value)
    );
  }

  get availableWorkTitles(): string[] {
    const titles = this.allQuotes
      .filter((quote) => quote.category === this.selectedCategory && quote.mediaType === this.selectedFormat)
      .map((quote) => quote.workTitle);

    return Array.from(new Set(titles)).sort((a, b) => a.localeCompare(b));
  }

  get currentDropdownLabel(): string {
    if (this.selectedWorkTitle) {
      return this.selectedWorkTitle;
    }

    return this.availableWorkTitles.length ? 'Todas las producciones' : 'Sin resultados';
  }

  setCategory(category: DiscoverCategory): void {
    this.selectedCategory = category;
    this.ensureValidWorkTitle();
    this.applyFilters();
  }

  setFormat(format: DiscoverFormat): void {
    this.selectedFormat = format;
    this.ensureValidWorkTitle();
    this.applyFilters();
  }

  selectWorkTitle(workTitle: string): void {
    this.selectedWorkTitle = workTitle;
    this.dropdownOpen = false;
  }

  clearWorkTitle(): void {
    this.selectedWorkTitle = '';
    this.dropdownOpen = false;
  }

  applyFilters(): void {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    this.filteredQuotes = this.allQuotes.filter((quote) => {
      const matchesCategory = quote.category === this.selectedCategory;
      const matchesFormat = quote.mediaType === this.selectedFormat;
      const matchesWork = !this.selectedWorkTitle || quote.workTitle === this.selectedWorkTitle;
      const matchesSearch =
        !normalizedSearch ||
        quote.text.toLowerCase().includes(normalizedSearch) ||
        quote.workTitle.toLowerCase().includes(normalizedSearch) ||
        quote.actorName.toLowerCase().includes(normalizedSearch) ||
        quote.characterName.toLowerCase().includes(normalizedSearch) ||
        quote.synopsis.toLowerCase().includes(normalizedSearch) ||
        quote.hashtags.some((hashtag) => hashtag.toLowerCase().includes(normalizedSearch));

      return matchesCategory && matchesFormat && matchesWork && matchesSearch;
    });
  }

  openQuote(quoteId: string): void {
    this.router.navigate(['/quote', quoteId]);
  }

  trackByQuoteId(_index: number, quote: Quote): string {
    return quote._id;
  }

  trackByOptionValue(_index: number, option: { value: string }): string {
    return option.value;
  }

  trackByTitle(_index: number, title: string): string {
    return title;
  }

  private ensureValidWorkTitle(): void {
    if (!this.selectedWorkTitle) {
      return;
    }

    if (!this.availableWorkTitles.includes(this.selectedWorkTitle)) {
      this.selectedWorkTitle = '';
    }
  }
}
