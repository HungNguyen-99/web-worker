import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, tap } from 'rxjs';
import { WorkerInput } from '../../models';
import { SearchResult } from '../../utils';
import { BookSearchFacade } from '../book-search/book-search.facade';

@Injectable()
export class BookSearchWorkerFacade extends BookSearchFacade {
  private readonly destroyRef = inject(DestroyRef);

  override search = this.effect<string>((term$) => {
    const data$: Observable<WorkerInput> = combineLatest({
      term: term$,
      paragraphs: this.paragraphs$,
    });

    return new Observable<SearchResult>((observer) => {
      let worker: Worker;

      try {
        worker = new Worker(new URL('./book-search.worker', import.meta.url), {
          type: 'module',
        });
        worker.onmessage = (event) => observer.next(event.data);
        worker.onerror = (event) => observer.error(event);

        data$
          .pipe(
            tap((value) => worker.postMessage(value)),
            takeUntilDestroyed(this.destroyRef)
          )
          .subscribe();
      } catch (error) {
        observer.error(error);
      }
    }).pipe(
      tap((value) => console.log(value)),
      tap((searchResult) => this.patchState({ result: searchResult }))
    );
  });
}
