import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'; 

@Injectable()
export class SearchService {

  apiRoot= 'https://images-api.nasa.gov/search?q=';
  
  constructor(private http: HttpClient) { }
  
  /*
  * This function receives a callback funtion to send back the aynchronous
  * response from the server. also pass in password and username
  */
   
  getSearchData(callback, keyWord: string) {
     if(keyWord != ""){
      this.http.get(this.apiRoot + encodeURI(keyWord)).subscribe(data => {
          callback(data['collection']['items']);
      });
     }
  }

}