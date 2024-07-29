import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { BookSearchWorkerComponent } from '../../components/book-search-worker/book-search-worker.component';
import { BookSearchComponent } from '../../components/book-search/book-search.component';

@Component({
  selector: 'app-book-container',
  standalone: true,
  imports: [BookSearchComponent, BookSearchWorkerComponent, AsyncPipe],
  providers: [],
  templateUrl: './book-container.component.html',
  styleUrl: './book-container.component.css',
})
export class BookContainerComponent {}
