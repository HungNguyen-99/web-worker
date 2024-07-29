import { Injectable, inject } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { auditTime, combineLatest, map, switchMap, tap } from 'rxjs';
import { BookApi } from '../../data-access';
import { BookChoice, BookInfo, books } from '../../models';
import { SearchResult, getAccumulatedSearchResults } from '../../utils';

type BookSearchState = {
  books: Record<BookChoice, BookInfo>;
  paragraphs: string[];
  result: SearchResult;
};

const initialState: BookSearchState = {
  books: books,
  paragraphs: [],
  result: {
    paragraphs: [],
    searchedParagraphCount: 0,
    paragraphCount: 0,
  },
};

@Injectable()
export class BookSearchFacade extends ComponentStore<BookSearchState> {
  private readonly bookApi = inject(BookApi);
  constructor() {
    super(initialState);
  }

  readonly books$ = this.select((state) => state.books).pipe(
    map((books) => Object.values(books))
  );

  readonly paragraphs$ = this.select((state) => state.paragraphs);

  readonly paragraphMatches$ = this.select((state) => state.result.paragraphs);
  readonly paragraphCount$ = this.select(
    (state) => state.result.paragraphCount
  );
  readonly searchedParagraphCount$ = this.select(
    (state) => state.result.searchedParagraphCount
  );
  readonly progress$ = this.select(
    this.searchedParagraphCount$,
    this.paragraphCount$,
    (paragraphCount, searchedParagraphCount) => {
      if (paragraphCount === 0) {
        return 0;
      }
      return Math.round((searchedParagraphCount / paragraphCount) * 100);
    }
  );

  vm$ = this.select(
    {
      books: this.books$,
      paragraphMatches: this.paragraphMatches$,
      paragraphCount: this.paragraphCount$,
      searchedParagraphCount: this.searchedParagraphCount$,
      progress: this.progress$,
    },
    { debounce: true }
  );

  getBook = this.effect<string>((url$) => {
    return url$.pipe(
      switchMap((url) => this.bookApi.getBook(url)),
      map((text) => this.splitTextIntoParagraphs(text)),
      tap((paragraphs) => this.patchState({ paragraphs }))
    );
  });

  search = this.effect<string>((term$) => {
    return combineLatest({
      term: term$,
      paragraphs: this.paragraphs$,
    }).pipe(
      switchMap(({ term, paragraphs }) =>
        getAccumulatedSearchResults(term, paragraphs)
      ),
      auditTime(1000 / 60),
      tap((value) => console.log(value)),
      tap((searchResult) => this.patchState({ result: searchResult }))
    );
  });

  private splitTextIntoParagraphs(text: string): string[] {
    return text.split(/\n\s*\n/);
  }
}
