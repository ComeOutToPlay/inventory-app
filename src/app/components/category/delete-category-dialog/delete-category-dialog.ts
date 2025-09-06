import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-delete-category-dialog',
  imports: [DialogModule, ButtonModule, TranslocoModule],
  templateUrl: './delete-category-dialog.html',
  styleUrl: './delete-category-dialog.css'
})
export class DeleteCategoryDialog {

   // Events notified to the father
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() delete = new EventEmitter<any>(); 
  @Output() cancel = new EventEmitter<void>();

  @Input() visible: boolean = false;
  @Input() categories: any[] = [];

  // Emits the save event
  onDelete() {

    this.delete.emit(this.categories);

    // Close the dialog
    this.visible = false;
  }
  
  onCancel() {
    this.cancel.emit();

    // Close the dialog
    this.visible = false;

    this.visibleChange.emit(this.visible);
  }
}