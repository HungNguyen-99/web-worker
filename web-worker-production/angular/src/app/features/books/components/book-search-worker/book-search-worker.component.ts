import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged, filter } from 'rxjs';
import { isNotNil } from '../../../../shared/utils';
import { BookFilter, BookSearchForm } from '../../models';
import { BookSearchFacade } from '../book-search/book-search.facade';
import { BookSearchWorkerFacade } from './book-search-worker.facade';

@Component({
  selector: 'app-book-search-worker',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './book-search-worker.component.html',
  styleUrl: './book-search-worker.component.css',
  providers: [{ provide: BookSearchFacade, useClass: BookSearchWorkerFacade }],
})
export class BookSearchWorkerComponent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly facade = inject(BookSearchFacade);

  $filter = output<BookFilter>({ alias: 'filter' });

  vm$ = this.facade.vm$;

  form!: BookSearchForm;

  ngOnInit(): void {
    this.initialForm();
    this.listenFormValueChanges();
  }

  private initialForm() {
    this.form = this.fb.group<BookSearchForm['controls']>({
      book: this.fb.control(null),
      searchTerm: this.fb.control(''),
    });
  }

  private listenFormValueChanges() {
    const { book, searchTerm } = this.form.controls;

    const book$ = book.valueChanges.pipe(
      distinctUntilChanged(),
      filter(isNotNil)
    );
    const searchTerm$ = searchTerm.valueChanges.pipe(distinctUntilChanged());

    this.facade.getBook(book$);
    this.facade.search(searchTerm$);
  }
}
