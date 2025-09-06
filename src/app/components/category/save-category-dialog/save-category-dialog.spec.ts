import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveCategoryDialog } from './save-category-dialog';

describe('SaveCategoryDialog', () => {
  let component: SaveCategoryDialog;
  let fixture: ComponentFixture<SaveCategoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaveCategoryDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaveCategoryDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
