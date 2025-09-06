import { Component, ViewChild } from '@angular/core';
import { CategoryData } from '../../models/category-data.model';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { CategoryService } from '../../services/category.service';
import { ButtonModule } from 'primeng/button';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { DialogModule } from 'primeng/dialog';
import { SaveCategoryDialog } from './save-category-dialog/save-category-dialog';
import { MessageService } from 'primeng/api';
import { DeleteCategoryDialog } from './delete-category-dialog/delete-category-dialog';

@Component({
  selector: 'app-category',
  imports: [TableModule, ButtonModule, DialogModule, TranslocoModule, SaveCategoryDialog, DeleteCategoryDialog],
  templateUrl: './category.html',
  styleUrl: './category.css'
})
export class Category {

  // Reference to the child component
  @ViewChild(SaveCategoryDialog) saveCategoryDialog!: SaveCategoryDialog;

  // Add these properties to your component to track pagination state
  first = 0;
  rows = 0;
  totalRecords = 0;

  datasource: CategoryData[];
  columns: any[];
  loading: boolean;
  multiSortMeta!: any[];
  globalFilterFields: string[];
  selectedRows: any[];
  lastTableLazyLoadEvent: TableLazyLoadEvent | undefined;
  rowsDefault: number;

  // Dialog
  visibleSaveDialog: boolean = false;
  visibleDeleteDialog: boolean = false;

  // Selected category to edit
  selectedCategoryToSave: any | null = null; 

  // Selected categories to delete
  selectedCategoriesToDelete: any[] = [];

  rowsPerPageOptions: number[];

  constructor(
    private categoryService: CategoryService,
    private translocoService: TranslocoService,
    private messageService: MessageService
  ) {
    this.rowsPerPageOptions = [5, 10, 15, 20];
    this.rowsDefault = 5;
    
    this.selectedRows = []

    this.columns = [
      { field: 'categoryId'},
      { field: 'name'}
    ]

    this.loading = true;
    this.multiSortMeta = [];
    this.globalFilterFields = ['id','name'];
    this.datasource = [];
  }

  get pageReportTemplate(): string {
    if (!this.datasource) {
      return '';
    }

    const totalItems = this.totalRecords;
    const firstItem = this.first + 1;
    const lastItem = this.first + this.datasource.length;

    return this.translocoService.translate('table.template.pagination', {
      first: firstItem,
      last: lastItem,
      total: totalItems
    });
  }

  loadDatasource(event: TableLazyLoadEvent){
    this.loading = true;
    this.lastTableLazyLoadEvent = event;

    // Update the first row when the event is loaded
    this.first = event.first ?? 0;

    this.categoryService.getAllByPage(event).subscribe(
      {
        next: (data: any) => { 
          this.datasource = data.items;
          this.totalRecords = data.totalItems;
          this.loading = false;
        },
        error: (err: any) => {

          // Error
        },
        complete: () => {}
      }
    );
  }

  // Open the dialog
  editDialog() {
    if (this.selectedRows.length === 1) {
      this.selectedCategoryToSave = this.selectedRows[0];

      // Force to load data in the child
      this.saveCategoryDialog.loadCategoryData(this.selectedCategoryToSave);

      this.visibleSaveDialog = true;
    }
  }
  
  // Open the dialog
  addDialog() {

    // There is no category selected
    this.selectedCategoryToSave = null;

    // Force to load data in the child
    this.saveCategoryDialog.loadCategoryData(null);

    this.visibleSaveDialog = true;
  }

  onSaveCategory(category: any) {
    // Aquí recibes los datos del formulario y los envías a tu servicio
    this.visibleSaveDialog = false;

    if (!category.categoryId) {    
      // Category creation
      this.categoryService.save(category).subscribe(
        {
          next: (data: any) => { 
            this.messageService.add({
              severity: 'success',
              summary: this.translocoService.translate('message.categoryCreated.summary'),
              detail: this.translocoService.translate('message.categoryCreated.detail')
            });

            // After successfully creating, reload the table data
            this.loadDatasource(this.lastTableLazyLoadEvent!);           
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translocoService.translate('message.categoryNotCreated.summary'),
              detail: this.translocoService.translate('message.categoryNotCreated.detail')
            });
          },
          complete: () => {}
        }
      );
    }
    else {
      // Category update
      this.categoryService.update(category.categoryId, category).subscribe(
        {
          next: (data: any) => { 
            this.messageService.add({
              severity: 'success',
              summary: this.translocoService.translate('message.categoryUpdated.summary'),
              detail: this.translocoService.translate('message.categoryUpdated.detail')
            });

            // After successfully creating, reload the table data
            this.loadDatasource(this.lastTableLazyLoadEvent!);           
          },
          error: (err: any) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translocoService.translate('message.categoryNotUpdated.summary'),
              detail: this.translocoService.translate('message.categoryNotUpdated.detail')
            });
          },
          complete: () => {}
        }
      );
    }
  }
  
  onCancelAddDialog() {
    this.visibleSaveDialog = false;
  }

  // Open the dialog
  deleteDialog() {
    this.visibleDeleteDialog = true;
  }

  onDeleteCategories(categories: any[]) {

    this.visibleDeleteDialog = false;
    const selectedIds = categories.map(c => c.categoryId).join(',');

    // Category creation
    this.categoryService.deleteList(selectedIds).subscribe(
      {
        next: (data: any) => { 
          this.messageService.add({
            severity: 'success',
            summary: this.translocoService.translate('message.categoryCreated.summary'),
            detail: this.translocoService.translate('message.categoryCreated.detail')
          });

          // After successfully creating, reload the table data
          this.loadDatasource(this.lastTableLazyLoadEvent!);           
        },
        error: (err: any) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translocoService.translate('message.categoryNotCreated.summary'),
            detail: this.translocoService.translate('message.categoryNotCreated.detail')
          });
        },
        complete: () => {}
      }
    );
  }
  

  onCancelDeleteDialog() {
    this.visibleDeleteDialog = false;
  }
}
