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
    // for(var i = 0; i < res.length; i++){
    //   $('#collections').append( "<li style='text-align:centre' > <h3> " + res[i]['name'] + "</h3><p id=T"+i+">"+ res[i]['desc'] + 
    //     "</p><div id=D"+i+"></div>"); 
    //     //<input id=pu"+i+" type=checkbox name='public'>Public
    //   for(var j = 0; j < res[i]['images'].length; j ++){
    //     $('#collections').append("<br><img  value='name' id="+i+""+j+" src = "+res[i]['images'][j] +"></li>" );
    //     $("#"+i+""+j).click({src : res[i]['images'][j], name : res[i]['name'] }, this.clickImg); 
    //   }
    //   $("#T"+i).click({name : res[i]['name'], desc : res[i]['desc'] }, this.editDesc); 
    // }
  }
  
  delCol(x){
    console.log('deleting collection:',x.name,'by:',localStorage.getItem('user'))
    this.userService.delCol(x._id);
    location.reload();
  }
  
  editCol(x){
    console.log(x);
    $("#name").attr('value', x.name);
    $("#desc").attr('value', x.desc);
    $("#desc").attr('name', x.name);
    $('#myModal2').css('display', 'block');
  }
  
  close1(){
    $('#myModal2').css('display', 'none');
  }
  
  saveCol(){
    console.log($("#name").attr('value'));
    this.userService.saveCol($("#name").attr('value'), $("#name").val(), $("#desc").val(), localStorage.getItem('user')); 
    $('#myModal').css('display', 'none'); 
    location.reload();
  }
  
  clickImg(img , x){
    $('#selectedImg').attr('src', img); 
    $('#selectedImg').attr('value', x.name); 
    $('#myModal').css('display', 'block'); 
  }
  
  close(){
    $('#myModal').css('display', 'none');
  }

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