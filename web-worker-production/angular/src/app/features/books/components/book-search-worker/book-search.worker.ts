/// <reference lib="webworker" />

import { auditTime, fromEvent, switchMap, tap } from 'rxjs';
import { WorkerInput } from '../../models';
import { getAccumulatedSearchResults } from '../../utils';

fromEvent<MessageEvent>(self, 'message')
  .pipe(
    switchMap((event: { data: WorkerInput }) => {
      const { paragraphs, term } = event.data;
      return getAccumulatedSearchResults(term, paragraphs);
    }),
    auditTime(1000 / 60),
    tap((value) => postMessage(value))
  )
  .subscribe();
