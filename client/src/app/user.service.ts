import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

  private isUserLoggedIn = false;
  private username;

  constructor(private http:HttpClient) {
      this.isUserLoggedIn = false;
  }
  
  setUserLoggedIn() {
      this.isUserLoggedIn = true;
      this.username = 'admin';
  }
  
  getUserLoggedIn() {
      return this.isUserLoggedIn;
  }
  
  getData(callback_fun) {
      this.http.get('/api').subscribe(data=> {
        console.log(data);
        callback_fun(data['message']);
      });
  }
  
  //posData(callback_fun, username)

}
