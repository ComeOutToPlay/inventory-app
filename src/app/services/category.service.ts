import { Injectable } from '@angular/core';
import { CrudService } from '../core/services/crud.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CategoryData } from '../models/category-data.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends CrudService <CategoryData, number> {

    constructor (
    httpClient: HttpClient
  ) {
    super(httpClient, environment.apiUrl, 'category');
  }

}
