import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { CrudOperations } from '../interfaces/crud-operations.interface';
import { TableLazyLoadEvent } from 'primeng/table';

export class CrudService<T, ID> implements CrudOperations<T, ID> {

  protected _fullApiUrl: string;

  constructor(
    protected http: HttpClient,
    protected apiUrl: string,
    protected resourcePath: string
  ) {
    // The full URL is constructed once in the constructor
    this._fullApiUrl = `${apiUrl}/${this.resourcePath}`;
  }

  save(t: T): Observable<T> {
    return this.http.post<T>(this._fullApiUrl, t);
  }

  saveList(list: T[]): Observable<T> {
    return this.http.post<T>(this._fullApiUrl + "/list", list);  
  }

  update(id: ID, t: T): Observable<T> {
    return this.http.put<T>(this._fullApiUrl + "/" + id, t);
  }

  get(id: ID): Observable<T> {
    return this.http.get<T>(this._fullApiUrl + "/" + id);
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this._fullApiUrl);
  }

  getAllByPage(event: TableLazyLoadEvent): Observable<T[]> {

    var page: number | undefined;
    var pageSize: number | undefined;

    if (event != undefined && event.first != undefined && event.rows != undefined)
    {
      page = event.first/event.rows + 1;
      pageSize = event.rows;
    }
    else
    {
      console.log("Error with ngPrime events");
      var data: T[];
      data = [];
      return of(data);
    }

    var url = this._fullApiUrl + "/page/" + page + "/" + pageSize;
    return this.http.get<T[]>(url);
  }

  delete(id: ID): Observable<any> {
    return this.http.delete<T>(this._fullApiUrl + '/' + id);
  }

  deleteList(ids: string): Observable<T> {
    return this.http.delete<T>(this._fullApiUrl + '/list/' + encodeURIComponent(ids));  
  }
}
