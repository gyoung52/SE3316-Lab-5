import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { UserService } from '../user.service'

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {

  //initialize response with empty string
  response = ''; 

  constructor(private user:UserService, private router:Router) { }

  ngOnInit() {
  }
  
  login(email, psw){
    this.user.postValidate(this.onResponse.bind(this), email, psw);
  }
  
  onResponse(res: string){
    this.response = res; 
    if(res == "success"){
      this.router.navigate(['/dashboard']);
    }
  }
  

}