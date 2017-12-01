import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UserService } from '../user.service'
import {Router} from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user = localStorage.getItem('user'); 
  @ViewChild('collections') collections: ElementRef;
  res = ''; 

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getCollections(this.onCollectionResponse.bind(this), localStorage.getItem('user')); 
  }
  
  onCollectionResponse(res : string){
    console.log(res);
    if(res[0] == null){
      return this.res = 'sorry to see that you have no collections'
    }
    for(var i = 0; i < res.length; i++){
    console.log(i);
      $('#collections').append( "<li style='text-align:centre' > <h3> " + res[i]['name'] + "</h3><p>" + res[i]['desc'] + "</p>"); 
      for(var j = 0; j < res[i]['images'].length; j ++){
        $('#collections').append("<img  src = "+res[i]['images'][j] +"></li>" ); 
      }
    }
  }
  
  imgClick(event){
    if(($('#wrap').children().length) > 0){
      $('#selectedImg').attr('src', event.data.src);
      $('#selectedImg').attr('value', e.data.name);
      $('#myModal').css('display', 'block'); 
    }
  }
  
  close(){
    $('#myModal').css('display', 'none');
  }
  
  delpic(){
    this.userService.deletefromCollection(this.user, $('selectedImg').attr('src'), $('#selectedImg').attr('value'));
    $('#myModal').css('display', 'none');
  }

}