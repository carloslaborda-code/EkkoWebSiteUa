import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Quote, QuoteService } from '../../services/quotes.services';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  allQuotes: Quote[] = [];
  featuredQuotes: Quote[] = [];
  visibleQuotes: Quote[] = [];
  searchTerm = '';
  loading = true;

  constructor(private quoteService: QuoteService, private router: Router) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  onSearchChange(): void {
    const normalized = this.searchTerm.trim().toLowerCase();

    if (!normalized) {
      this.visibleQuotes = [...this.featuredQuotes];
      return;
    }

    this.visibleQuotes = this.featuredQuotes.filter((quote) => {
      return (
        quote.text.toLowerCase().includes(normalized) ||
        quote.workTitle.toLowerCase().includes(normalized) ||
        quote.category.toLowerCase().includes(normalized)
      );
    });
  }

  getStarArray(rating: number): boolean[] {
    const fullStars = Math.round(rating);
    return Array.from({ length: 5 }, (_, index) => index < fullStars);
  }

  trackByQuoteId(_: number, quote: Quote): string {
    return quote._id;
  }

  openProfile(): void {
    this.router.navigate([this.isLoggedIn ? '/profile' : '/login']);
  }

  openDiscover(): void {
    this.router.navigate(['/discover']);
  }

  openQuote(quoteId: string): void {
    this.router.navigate(['/quote', quoteId]);
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  private loadQuotes(): void {
    this.quoteService.getQuotes().subscribe({
      next: (quotes) => {
        this.allQuotes = quotes;
        this.featuredQuotes = this.buildFeaturedQuotes(quotes);
        this.visibleQuotes = [...this.featuredQuotes];
        this.loading = false;
      },
      error: () => {
        this.allQuotes = [];
        this.featuredQuotes = [];
        this.visibleQuotes = [];
        this.loading = false;
      }
    });
  }

  private buildFeaturedQuotes(quotes: Quote[]): Quote[] {
    const categoryOrder: Array<Quote['category']> = ['movie', 'series', 'game', 'sfx'];

    return categoryOrder
      .map((category) => {
        const bestQuote = quotes
          .filter((quote) => quote.category === category)
          .sort((left, right) => {
            if (right.rating !== left.rating) {
              return right.rating - left.rating;
            }

            return this.parseViews(right.views) - this.parseViews(left.views);
          })[0];

        return bestQuote || null;
      })
      .filter((quote): quote is Quote => quote !== null);
  }

  private parseViews(views: string): number {
    const normalized = String(views || '0').trim().toUpperCase().replace(',', '.');
    const multiplier = normalized.endsWith('M') ? 1_000_000 : normalized.endsWith('K') ? 1_000 : 1;
    const numericPart = multiplier === 1 ? normalized : normalized.slice(0, -1);
    const parsed = Number.parseFloat(numericPart);

    if (!Number.isFinite(parsed)) {
      return 0;
    }

    return Math.round(parsed * multiplier);
  }
}
