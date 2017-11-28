import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { UserService } from '../user.service'

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  response = '';
  
  constructor(private router:Router, private user:UserService) { }

  ngOnInit() {
  }
  
  loginUser(e) {
    var username = e.target.elements[0].value;
    var password = e.target.elements[1].value;
    console.log(username, password)
    
    if( username == 'admin' && password == 'admin') {
      this.user.setUserLoggedIn();
      this.router.navigate(['/dashboard']);
      this.response = 'admin logged in';
    }
    else {
      this.response = 'credentials wrong';
    }
    this.user.getData(this.onResponse.bind(this));
  }
  
  onResponse(res: string) {
    this.response = res;
  }
  
  

}
