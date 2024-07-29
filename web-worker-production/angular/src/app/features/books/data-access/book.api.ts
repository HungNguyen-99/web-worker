import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookApi {
  private readonly _http = inject(HttpClient);
  constructor() {}

  getBook(url: string): Observable<string> {
    return this._http.get(url, { responseType: 'text' });
  }
}
