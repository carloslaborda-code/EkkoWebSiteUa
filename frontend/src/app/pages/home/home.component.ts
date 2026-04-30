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

  constructor(private quoteService: QuoteService, public router: Router) {}

  ngOnInit(): void {
    this.loadQuotes();
  }

  onSearchChange(): void {
    const normalized = this.normalizeSearchText(this.searchTerm);

    if (!normalized) {
      this.visibleQuotes = [...this.featuredQuotes];
      return;
    }

    this.visibleQuotes = this.allQuotes
      .map((quote) => ({
        quote,
        score: this.getSearchScore(quote, normalized)
      }))
      .filter(({ score }) => score > 0)
      .sort((left, right) => {
        if (right.score !== left.score) {
          return right.score - left.score;
        }

        if (right.quote.rating !== left.quote.rating) {
          return right.quote.rating - left.quote.rating;
        }

        return this.parseViews(right.quote.views) - this.parseViews(left.quote.views);
      })
      .map(({ quote }) => quote);
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

  private getSearchScore(quote: Quote, normalizedQuery: string): number {
    const queryTokens = normalizedQuery.split(' ').filter((token) => token.length > 1);
    const quoteText = this.normalizeSearchText(quote.text);
    const workTitle = this.normalizeSearchText(quote.workTitle);
    const metadata = this.normalizeSearchText([
      quote.actorName,
      quote.characterName,
      quote.synopsis,
      quote.category,
      ...quote.hashtags
    ].join(' '));
    const searchable = `${quoteText} ${workTitle} ${metadata}`;
    const searchableWords = searchable.split(' ').filter(Boolean);
    let score = 0;

    if (quoteText.includes(normalizedQuery)) {
      score += 120;
    }

    if (workTitle.includes(normalizedQuery)) {
      score += 90;
    }

    if (metadata.includes(normalizedQuery)) {
      score += 45;
    }

    queryTokens.forEach((token) => {
      if (quoteText.includes(token)) {
        score += 22;
      }

      if (workTitle.includes(token)) {
        score += 18;
      }

      if (metadata.includes(token)) {
        score += 10;
      }

      const bestSimilarity = this.getBestTokenSimilarity(token, searchableWords);
      if (bestSimilarity >= 0.72) {
        score += Math.round(bestSimilarity * 12);
      }
    });

    return score;
  }

  private normalizeSearchText(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
  }

  private getBestTokenSimilarity(token: string, words: string[]): number {
    if (token.length < 3) {
      return 0;
    }

    return words.reduce((best, word) => {
      if (word.length < 3) {
        return best;
      }

      if (word.startsWith(token) || token.startsWith(word)) {
        return Math.max(best, 0.92);
      }

      const distance = this.getLevenshteinDistance(token, word);
      const maxLength = Math.max(token.length, word.length);
      const similarity = maxLength ? 1 - distance / maxLength : 0;

      return Math.max(best, similarity);
    }, 0);
  }

  private getLevenshteinDistance(left: string, right: string): number {
    const previous = Array.from({ length: right.length + 1 }, (_, index) => index);
    const current = Array(right.length + 1).fill(0);

    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
      current[0] = leftIndex;

      for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
        const substitutionCost = left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1;
        current[rightIndex] = Math.min(
          current[rightIndex - 1] + 1,
          previous[rightIndex] + 1,
          previous[rightIndex - 1] + substitutionCost
        );
      }

      for (let index = 0; index <= right.length; index += 1) {
        previous[index] = current[index];
      }
    }

    return previous[right.length];
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
