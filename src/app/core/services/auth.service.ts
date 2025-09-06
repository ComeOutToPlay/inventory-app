import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
 
/* To mock login */
import { Observable, of } from 'rxjs';
import { UserData } from '../../models/user-data.model';
import { environment } from '../../../environments/environment';
 
@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  headers: HttpHeaders | undefined;
  public userData: UserData | undefined;


  constructor (
    private _httpClient: HttpClient
  ) {
  }
   
  /**
   * Gets user info from SessionStorage and load userData public property.
   */
  refreshUserData() {
   
    this.userData = this.getUserData();
  }
 
  /**
   * Gets userData from SessionStorage.
   */
  getUserData() {
 
    var result = null;
    var data = sessionStorage.getItem('userData');
 
    if (data != null)
    {
      result = JSON.parse(data);
    }
   
    return result;
  }
 
  /**
   * Save userData in the Session Storage and set the public property userData.
   */
  setUserData(userData: UserData) {
 
      sessionStorage.setItem('userData', JSON.stringify(userData));
     
      this.userData = this.getUserData();
 
      this.setHeaders();
  }
 
  /**
   * Initialize the public property named "headers". This property will be injected
   * in every Request, including the Authorization attribute, which contains the userData token.
   */
  setHeaders(){


    if (this.userData != undefined && this.userData.token != undefined)
    {
        this.headers = new HttpHeaders ({
          'Content-Type': 'application/json',
          'Accept' : 'application/json',
          'Authorization': this.userData.token
        });
      }
    }
 
  /**
   * Remove userData from Session Storage and sets the userData property to null.
   */
  removeUserData() {
    sessionStorage.removeItem('userData');
    this.userData=undefined;
  }
 
  isLogged()
  {
    return sessionStorage.getItem('userData') != null;
  }
 
  login(username: string, password: string): Observable<any> {
 
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    var loginModel = {username: username, password: password };
    return this._httpClient.post<any>(environment.apiUrl  + '/auth/login', loginModel, httpOptions);
  }
}
