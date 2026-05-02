import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppIconName } from '../../components/icon/icon.component';
import { SavedQuote, UserService } from '../../services/user.service';

type LibraryFormat = 'all' | 'video' | 'audio';
type LibraryCategory = 'all' | 'movie' | 'series' | 'game' | 'sfx';
type LibrarySort = 'recent' | 'rating' | 'title';

interface LibraryItem extends SavedQuote {
  originalIndex: number;
}

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  allSavedQuotes: LibraryItem[] = [];
  visibleQuotes: LibraryItem[] = [];
  searchTerm = '';
  selectedFormat: LibraryFormat = 'all';
  selectedCategory: LibraryCategory = 'all';
  selectedSort: LibrarySort = 'recent';
  loading = true;
  errorMessage = '';

  readonly formatOptions: Array<{ label: string; value: LibraryFormat; icon: AppIconName }> = [
    { label: 'Todo', value: 'all', icon: 'bookmark' },
    { label: 'Video', value: 'video', icon: 'play-solid' },
    { label: 'Audio', value: 'audio', icon: 'speaker-wave' }
  ];

  readonly categoryOptions: Array<{ label: string; value: LibraryCategory; icon: AppIconName }> = [
    { label: 'Todo', value: 'all', icon: 'bookmark' },
    { label: 'Pelicula', value: 'movie', icon: 'film' },
    { label: 'Serie', value: 'series', icon: 'tv' },
    { label: 'Videojuego', value: 'game', icon: 'gamepad' },
    { label: 'Efectos', value: 'sfx', icon: 'speaker-wave' }
  ];

  readonly sortOptions: Array<{ label: string; value: LibrarySort }> = [
    { label: 'Recientes', value: 'recent' },
    { label: 'Mejor valorados', value: 'rating' },
    { label: 'Titulo', value: 'title' }
  ];

  constructor(private userService: UserService, public router: Router) {}

  ngOnInit(): void {
    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    this.userService.getCurrentUser().subscribe({
      next: (profile) => {
        this.allSavedQuotes = (profile.savedQuotes || []).map((quote, index) => this.normalizeQuote(quote, index));
        this.loading = false;
        this.applyFilters();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'No se pudo cargar tu biblioteca.';
      }
    });
  }

  get savedCount(): number {
    return this.allSavedQuotes.length;
  }

  get videoCount(): number {
    return this.allSavedQuotes.filter((quote) => quote.mediaType === 'video').length;
  }

  get audioCount(): number {
    return this.allSavedQuotes.filter((quote) => quote.mediaType === 'audio').length;
  }

  get hasActiveFilters(): boolean {
    return !!this.searchTerm.trim() || this.selectedFormat !== 'all' || this.selectedCategory !== 'all';
  }

  setFormat(format: LibraryFormat): void {
    this.selectedFormat = format;
    this.applyFilters();
  }

  setCategory(category: LibraryCategory): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  setSort(sort: LibrarySort): void {
    this.selectedSort = sort;
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedFormat = 'all';
    this.selectedCategory = 'all';
    this.selectedSort = 'recent';
    this.applyFilters();
  }

  applyFilters(): void {
    const normalizedSearch = this.searchTerm.trim().toLowerCase();

    this.visibleQuotes = this.allSavedQuotes
      .filter((quote) => {
        const matchesFormat = this.selectedFormat === 'all' || quote.mediaType === this.selectedFormat;
        const matchesCategory = this.selectedCategory === 'all' || quote.category === this.selectedCategory;
        const matchesSearch =
          !normalizedSearch ||
          quote.text.toLowerCase().includes(normalizedSearch) ||
          quote.workTitle.toLowerCase().includes(normalizedSearch) ||
          String(quote.year).includes(normalizedSearch) ||
          quote.actorName.toLowerCase().includes(normalizedSearch) ||
          quote.characterName.toLowerCase().includes(normalizedSearch) ||
          quote.hashtags.some((hashtag) => hashtag.toLowerCase().includes(normalizedSearch));

        return matchesFormat && matchesCategory && matchesSearch;
      })
      .sort((first, second) => this.compareQuotes(first, second));
  }

  openQuote(quoteId: string): void {
    this.router.navigate(['/quote', quoteId]);
  }

  trackByQuoteId(_index: number, quote: LibraryItem): string {
    return quote._id;
  }

  getCategoryLabel(category: string): string {
    const found = this.categoryOptions.find((option) => option.value === category);
    return found?.label || 'Contenido';
  }

  getRatingLabel(quote: LibraryItem): string {
    return quote.rating.toFixed(1);
  }

  getRatingSummary(quote: LibraryItem): string {
    const ratingsLabel = quote.ratingsCount === 1 ? '1 valoracion' : `${quote.ratingsCount} valoraciones`;
    return `${this.getRatingLabel(quote)} (${ratingsLabel})`;
  }

  getViewsLabel(quote: LibraryItem): string {
    const safeViews = this.parseCount(quote.views);
    const formattedViews = new Intl.NumberFormat('es-ES').format(safeViews);
    return safeViews === 1 ? '1 visita' : `${formattedViews} visitas`;
  }

  getStarArray(rating: number): boolean[] {
    const normalizedRating = Math.max(0, Math.min(5, Number.isFinite(rating) ? rating : 0));
    return Array.from({ length: 5 }, (_item, index) => index < Math.round(normalizedRating));
  }

  trackByOptionValue(_index: number, option: { value: string }): string {
    return option.value;
  }

  trackByBooleanIndex(index: number): number {
    return index;
  }

  private compareQuotes(first: LibraryItem, second: LibraryItem): number {
    if (this.selectedSort === 'rating') {
      return second.rating - first.rating || second.originalIndex - first.originalIndex;
    }

    if (this.selectedSort === 'title') {
      return first.workTitle.localeCompare(second.workTitle) || second.originalIndex - first.originalIndex;
    }

    return second.originalIndex - first.originalIndex;
  }

  private normalizeQuote(quote: SavedQuote, index: number): LibraryItem {
    const category = this.isLibraryCategory(quote.category) ? quote.category : 'movie';

    return {
      ...quote,
      text: quote.text || '',
      workTitle: quote.workTitle || 'Fragmento guardado',
      year: Number.isFinite(quote.year) ? quote.year : 0,
      rating: Number.isFinite(quote.rating) ? quote.rating : 0,
      ratingsCount: Number.isFinite(quote.ratingsCount) ? quote.ratingsCount : 0,
      views: quote.views || '0',
      image: quote.image || '',
      mediaType: quote.mediaType === 'audio' ? 'audio' : 'video',
      duration: quote.duration || '00:00',
      actorName: quote.actorName || '',
      characterName: quote.characterName || '',
      hashtags: Array.isArray(quote.hashtags) ? quote.hashtags : [],
      category,
      originalIndex: index
    };
  }

  private isLibraryCategory(category: string): category is Exclude<LibraryCategory, 'all'> {
    return category === 'movie' || category === 'series' || category === 'game' || category === 'sfx';
  }

  private parseCount(value: string): number {
    const normalized = String(value || '0').trim().toUpperCase().replace(',', '.');
    const multiplier = normalized.endsWith('M') ? 1_000_000 : normalized.endsWith('K') ? 1_000 : 1;
    const numericPart = multiplier === 1 ? normalized : normalized.slice(0, -1);
    const parsed = Number.parseFloat(numericPart);

    return Number.isFinite(parsed) ? Math.round(parsed * multiplier) : 0;
  }
}
