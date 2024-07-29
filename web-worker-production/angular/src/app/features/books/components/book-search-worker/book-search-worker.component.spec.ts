import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookSearchWorkerComponent } from './book-search-worker.component';

describe('BookSearchWorkerComponent', () => {
  let component: BookSearchWorkerComponent;
  let fixture: ComponentFixture<BookSearchWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookSearchWorkerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookSearchWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
