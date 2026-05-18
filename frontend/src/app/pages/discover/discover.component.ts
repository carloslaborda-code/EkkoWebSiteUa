import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faChevronDown, faClapperboard, faGamepad, faMagnifyingGlass, faPlay, faTv, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import { Quote, QuoteService } from '../../services/quotes.services';

type DiscoverCategory = 'movie' | 'series' | 'game' | 'sfx';
type DiscoverFormat = 'video' | 'audio';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.css']
})
export class DiscoverComponent implements OnInit {
  @ViewChild('workTitleTrigger') workTitleTrigger?: ElementRef<HTMLButtonElement>;
  @ViewChild('workTitleListbox') workTitleListbox?: ElementRef<HTMLDivElement>;
  allQuotes: Quote[] = [];
  filteredQuotes: Quote[] = [];
  searchTerm = '';
  selectedCategory: DiscoverCategory = 'movie';
  selectedFormat: DiscoverFormat = 'video';
  selectedWorkTitle = '';
  loading = true;
  dropdownOpen = false;
  readonly faChevronDown = faChevronDown;
  readonly faMagnifyingGlass = faMagnifyingGlass;
  readonly faPlay = faPlay;
  readonly faVolumeHigh = faVolumeHigh;

  readonly categoryOptions: Array<{ label: string; value: DiscoverCategory; icon: IconDefinition }> = [
    { label: 'Pelicula', value: 'movie', icon: faClapperboard },
    { label: 'Serie', value: 'series', icon: faTv },
    { label: 'Videojuego', value: 'game', icon: faGamepad },
    { label: 'Efectos', value: 'sfx', icon: faVolumeHigh }
  ];

  constructor(private quoteService: QuoteService, public router: Router) {}

  @HostListener('document:click', ['$event'])
  handleDocumentClick(event: MouseEvent): void {
    if (!this.dropdownOpen) {
      return;
    }

    const target = event.target as Node | null;
    const trigger = this.workTitleTrigger?.nativeElement;
    const listbox = this.workTitleListbox?.nativeElement;

    if (target && (trigger?.contains(target) || listbox?.contains(target))) {
      return;
    }

    this.closeDropdown();
  }

  @HostListener('document:keydown.escape')
  handleEscapeKey(): void {
    this.closeDropdown(true);
  }

  ngOnInit(): void {
    this.quoteService.getQuotes().subscribe({
      next: (quotes) => {
        this.allQuotes = quotes;
        this.ensureValidCategory();
        this.ensureValidFormat();
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

  get visibleCategoryOptions(): Array<{ label: string; value: DiscoverCategory; icon: IconDefinition }> {
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
    this.ensureValidFormat();
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
    this.closeDropdown(true);
  }

  clearWorkTitle(): void {
    this.selectedWorkTitle = '';
    this.closeDropdown(true);
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
        quote.accessibilityText.toLowerCase().includes(normalizedSearch) ||
        quote.hashtags.some((hashtag) => hashtag.toLowerCase().includes(normalizedSearch));

      return matchesCategory && matchesFormat && matchesWork && matchesSearch;
    });
  }

  openQuote(quoteId: string): void {
    this.router.navigate(['/quote', quoteId]);
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;

    if (this.dropdownOpen) {
      queueMicrotask(() => {
        this.workTitleListbox?.nativeElement.querySelector<HTMLButtonElement>('button')?.focus();
      });
      return;
    }

    this.workTitleTrigger?.nativeElement.focus();
  }

  onDropdownTriggerKeydown(event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }

    event.preventDefault();

    if (!this.dropdownOpen) {
      this.dropdownOpen = true;
    }

    queueMicrotask(() => {
      const options = this.getDropdownOptions();
      if (!options.length) {
        return;
      }

      const targetIndex = event.key === 'ArrowUp' ? options.length - 1 : 0;
      options[targetIndex].focus();
    });
  }

  onDropdownOptionKeydown(event: KeyboardEvent, optionIndex: number): void {
    const options = this.getDropdownOptions();
    if (!options.length) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      options[(optionIndex + 1) % options.length].focus();
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      options[(optionIndex - 1 + options.length) % options.length].focus();
      return;
    }

    if (event.key === 'Home') {
      event.preventDefault();
      options[0].focus();
      return;
    }

    if (event.key === 'End') {
      event.preventDefault();
      options[options.length - 1].focus();
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.ensureValidCategory();
    this.ensureValidFormat();
    this.selectedWorkTitle = '';
    this.applyFilters();
    this.closeDropdown();
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

  private ensureValidCategory(): void {
    const visibleCategories = this.visibleCategoryOptions.map((option) => option.value);
    if (visibleCategories.includes(this.selectedCategory) || !visibleCategories.length) {
      return;
    }

    this.selectedCategory = visibleCategories[0];
  }

  private ensureValidFormat(): void {
    const hasSelectedFormat = this.allQuotes.some((quote) =>
      quote.category === this.selectedCategory && quote.mediaType === this.selectedFormat
    );

    if (hasSelectedFormat) {
      return;
    }

    const fallbackFormat = this.allQuotes.find((quote) => quote.category === this.selectedCategory)?.mediaType;
    this.selectedFormat = fallbackFormat === 'audio' ? 'audio' : 'video';
  }

  private closeDropdown(returnFocus = false): void {
    if (!this.dropdownOpen) {
      return;
    }

    this.dropdownOpen = false;

    if (returnFocus) {
      queueMicrotask(() => this.workTitleTrigger?.nativeElement.focus());
    }
  }

  private getDropdownOptions(): HTMLButtonElement[] {
    return Array.from(this.workTitleListbox?.nativeElement.querySelectorAll<HTMLButtonElement>('button') || []);
  }
}
