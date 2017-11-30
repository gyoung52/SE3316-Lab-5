import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../user.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

  response = ''; 
  username = '';
  password = '';
  confPassword = '';
  
  constructor(private router:Router, private user:UserService) { }

  ngOnInit() {
  }
  
  createAccount(e) {
    this.username = e.target.elements[0].value;
    this.password = e.target.elements[1].value;
    this.confPassword = e.target.elements[2].value;
    
    if(this.password == this.confPassword) {
      
      this.user.postData(this.onResponse.bind(this), this.username, this.password);
      console.log('Account created');
      this.user.setUserLoggedIn(true);
      this.router.navigate(['/dashboard']);
    }
    else {
      alert('Password was not confirmed correctly');
      this.router.navigate(['/createaccount']);
    }
  }
  
  onResponse(res: string) {
    this.response = res;
  }

}
