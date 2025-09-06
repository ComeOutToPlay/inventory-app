import { Injectable } from '@angular/core';
import { CrudService } from '../core/services/crud.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ProductData } from '../models/product-data.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends CrudService <ProductData, number> {

    constructor (
    httpClient: HttpClient
  ) {
    super(httpClient, environment.apiUrl, 'product');
  }

}
