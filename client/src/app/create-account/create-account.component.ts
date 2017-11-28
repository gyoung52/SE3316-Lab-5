import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../user.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent implements OnInit {

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
      console.log('Account created');
      this.user.setUserLoggedIn();
      this.router.navigate(['/dashboard']);
    }
    else {
      alert('Password was not confirmed correctly');
      this.router.navigate(['/createaccount']);
    }
  }

}
