import { Routes } from '@angular/router';
import { BookContainerComponent } from './containers/book-container/book-container.component';

export const bookRoutes: Routes = [
  {
    path: '',
    providers: [],
    component: BookContainerComponent,
  },
];
