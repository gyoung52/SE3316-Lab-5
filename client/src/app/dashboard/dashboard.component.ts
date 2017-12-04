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
  collection = '';
  @ViewChild('collections') collections: ElementRef;
  res = '';

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getCollections(this.onCollectionResponse.bind(this), localStorage.getItem('user')); 
  }
  
  onCollectionResponse(res : string){
    this.collection = res; 
    if(res[0] == null){
      return this.res = 'You have no collections'
    }
  }
  
  //delete collection function
  delCol(x){
    console.log('deleting collection:',x.name,'by:',localStorage.getItem('user'))
    this.userService.delCol(x._id);
    location.reload();
  }
  
  //edit collection function
  editCol(x){
    console.log(x);
    $("#name").attr('value', x.name);
    $("#desc").attr('value', x.desc);
    $("#desc").attr('name', x.name);
    $('#myModal2').css('display', 'block');
  }
  
  //closes modal
  close1(){
    $('#myModal2').css('display', 'none');
  }
  
  //saves changes to collections
  saveCol(){
    console.log($("#name").attr('value'));
    this.userService.saveCol($("#name").attr('value'), $("#name").val(), $("#desc").val(), localStorage.getItem('user')); 
    $('#myModal').css('display', 'none'); 
    location.reload();
  }
  
  //opens modal
  clickImg(img , x){
    $('#selectedImg').attr('src', img); 
    $('#selectedImg').attr('value', x.name); 
    $('#myModal').css('display', 'block'); 
  }
  
  close(){
    $('#myModal').css('display', 'none');
  }

  //function for deleting picture
  delPic(){
    this.userService.deletefromCollection(this.user, $('#selectedImg').attr('src'), $('#selectedImg').attr('value')); 
    $('#myModal').css('display', 'none'); 
    location.reload();
  }
  
  privacyChange(x){
    if(x.ispublic){
      this.userService.changePrivacy(!x.ispublic, x);
    }else{
      this.userService.changePrivacy(!x.ispublic, x);
    }
  }

}