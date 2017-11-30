import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

  private isUserLoggedIn = false;

  constructor(private http:HttpClient) {
      this.isUserLoggedIn = false;
  }
  
  setUserLoggedIn(status) {
      this.isUserLoggedIn = status;
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
  
  postData(callback_fun, username, password) {
    this.http.post('/api/creataccount', username, password).subscribe(data=> {
      console.log(data);
      callback_fun(data['message']);
    });
  }
  
  

}
