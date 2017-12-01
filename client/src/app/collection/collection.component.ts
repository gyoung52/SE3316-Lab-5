import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service'; 
import {Router} from '@angular/router';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.css']
})
export class CollectionComponent implements OnInit {

  //initialize response with empty string
  response = ''; 

  constructor(private user:UserService, private router:Router) { }

  ngOnInit() {
  }
  
  collectionCreate(name, desc){
    this.user.createCollection(this.onResponse.bind(this), name, desc);
  }
  
  onResponse(res: string){
    this.response = res; 
    if(res == "success"){
      this.router.navigate(['/dashboard']);
    }
  }
}