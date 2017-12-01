import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {UserService} from '../user.service'; 

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  //initialize response with empty string
  response = ''; 

  constructor(private userService:UserService, private router:Router) { }

  ngOnInit() {
  }
  
  verify(code){
    this.userService.verifyEmail(this.onResponse.bind(this), code);
  }
  
  onResponse(res: string){
    this.response = res; 
    if(res == "verification success"){
      this.router.navigate(['/login']); 
    }
  }

}