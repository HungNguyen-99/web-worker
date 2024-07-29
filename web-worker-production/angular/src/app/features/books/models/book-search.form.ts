import { FormControl, FormGroup } from '@angular/forms';

export type BookSearchForm = FormGroup<{
  book: FormControl<string | null>;
  searchTerm: FormControl<string>;
}>;
