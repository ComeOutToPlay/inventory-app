import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-save-category-dialog',
  imports: [DialogModule, ReactiveFormsModule, ButtonModule, InputTextModule, TranslocoModule],
  templateUrl: './save-category-dialog.html',
  styleUrl: './save-category-dialog.css'
})
export class SaveCategoryDialog {

  // Flag to control the edit mode
  isEditMode: boolean = false;

   // Events notified to the father
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<any>(); 
  @Output() cancel = new EventEmitter<void>();

  // Reactive form validation
  addCategoryForm = new FormGroup({
    categoryId: new FormControl(null),
    name: new FormControl('', Validators.required)
  });

  // Used for the visible() getter and setter
  private _visible = false;

  // The @Input() property receives the value from the parent.
  @Input()
  get visible(): boolean {
    return this._visible;
  }

  // The setter updates the backing field and emits the change.
  set visible(value: boolean) {
    if (this._visible !== value) {
      this._visible = value;
      this.visibleChange.emit(value);

      // Resets the form when the dialog is made visible, only if not in edit mode
      // If not is done this way, the second time a dialog is opened, 
      // the form does not show the values of the category
      if (value && !this.isEditMode) {
        this.addCategoryForm.reset();
      }
    }
  }

  @Input()
  set category(value: any) {

    if (value) {
      // Load the form with the category
      this.addCategoryForm.patchValue(value);

      this.isEditMode = true;

    } else {
      // Reset the form, to start adding a new category
      this.addCategoryForm.reset();

      this.isEditMode = false;
    }
  }

  loadCategoryData(category: any) {
    
    this.addCategoryForm.reset();
    if (category) {
      this.addCategoryForm.patchValue(category);
    }
  }  

  // Emits the save event
  onSave() {
    if (this.addCategoryForm.valid) {
      const formValue = this.addCategoryForm.value;

      this.save.emit(formValue);

      // Close the dialog
      this.visible = false;
    }
  }
  
  onCancel() {
    this.cancel.emit();

    // Close the dialog
    this.visible = false;
  }
}
