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
      this.visibleQuotes = [...this.allQuotes];
      return;
    }

    this.visibleQuotes = this.allQuotes.filter((quote) => {
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

  get isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  private loadQuotes(): void {
    this.quoteService.getQuotes().subscribe({
      next: (quotes) => {
        this.allQuotes = quotes;
        this.visibleQuotes = [...quotes];
        this.loading = false;
      },
      error: () => {
        this.allQuotes = [];
        this.visibleQuotes = [];
        this.loading = false;
      }
    });
  }
}
