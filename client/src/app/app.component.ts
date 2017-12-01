import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'NASA Image Collection';
  user = localStorage.getItem('user') != null;  
  
  logout(){
    localStorage.removeItem('user'); 
  }
  
}