import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  collectionList = new Array();
  isLiked = new Array();
  imgCollection = [];
  
  constructor(private userService: UserService) {
    this.userService.getHomeCollections(this.onGetAllCollectionsResponse.bind(this));
  }
  // make it so the user's collections don't show up
  onGetAllCollectionsResponse(res: string){
    this.collectionList = new Array();
    console.log(res);
    for(var i = 0; i < res.length; i ++){
      if(res[i]['ispublic'] == true && res[i]['user'] !== localStorage.getItem('user')) {
        if (res[i]['images'].length != 0){
          console.log(res[i]['name'])
          this.collectionList.push(res[i]);
        }
      }
    }
    this.isLiked = new Array();
    for(var  i = 0; i < this.collectionList.length; i++){
      console.log(i);
      if(this.collectionList[i]['rank'].indexOf(localStorage.getItem('user')) > -1){
        this.isLiked.push(true);
      }else{
        this.isLiked.push(false);
      }
      
    }
    console.log(this.isLiked);
  }
  
  openPhotos(photos){
    console.log(photos);
    this.imgCollection = photos; 
    $('#selectedImg').attr('src', photos[0]); 
    $('#selectedImg').attr('value', 0); 
    $('#myModal').css('display', 'block'); 
  }
  
  close(){
    $('#myModal').css('display', 'none');
    this.imgCollection = []; 
  }
  
  next(){
    console.log(this.imgCollection); 
    var index = (parseInt($('#selectedImg').attr('value')) + 1)% this.imgCollection.length; 
    $('#selectedImg').attr('src', this.imgCollection[index]); 
    $('#selectedImg').attr('value', index); 
    // console.log(index); 
  }
  
  checkLike(user,name, i){
    this.userService.setLike(this.onGetAllCollectionsResponse.bind(this), user, name);
  }
  ngOnInit() {
  }

}