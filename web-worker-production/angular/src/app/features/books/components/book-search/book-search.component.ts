import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { provideComponentStore } from '@ngrx/component-store';
import { distinctUntilChanged, filter } from 'rxjs';
import { isNotNil } from '../../../../shared/utils';
import { BookFilter, BookSearchForm } from '../../models';
import { BookSearchFacade } from './book-search.facade';

@Component({
  selector: 'app-book-search',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './book-search.component.html',
  styleUrl: './book-search.component.css',
  providers: [provideComponentStore(BookSearchFacade)],
})
export class BookSearchComponent implements OnInit {
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
