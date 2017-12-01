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

  constructor(private userService:UserService, private router:Router) { }

  ngOnInit() {
  }
  
  signUp(email, psw){
    console.log(email," ",psw)
    this.userService.postData(this.onResponse.bind(this), email, psw); 
  }
  
  onResponse(res: string){
    this.response = res; 
    if(res == "Account created"){
      this.router.navigate(['/verify']); 
    }
  }

}