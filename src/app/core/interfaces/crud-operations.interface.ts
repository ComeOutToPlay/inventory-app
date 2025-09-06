import { Observable } from 'rxjs';
 
export interface CrudOperations<T, ID> {
  save(t: T): Observable<T>;
  saveList(list: T[]): Observable<T>;
  update(id: ID, t: T): Observable<T>;
  get(id: ID): Observable<T>;
  getAll(): Observable<T[]>;
  getAllByPage(event: any): Observable<T[]>;
  delete(id: ID): Observable<any>;
  deleteList(ids: number[]): Observable<T>;
}
