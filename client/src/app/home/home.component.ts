import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  collectionList = new Array();
  isLiked = new Array();
  constructor(private userService: UserService) {
    this.userService.getHomeCollections(this.onGetAllCollectionsResponse.bind(this));
    
  }
  // make it so the user's collections don't show up
  onGetAllCollectionsResponse(res: string){
    this.collectionList = new Array();
    for(var i = 0; i < res.length; i ++){
      if(res[i]['ispublic'] == true){
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
  openPhotos(){
    console.log('opening images');
  }
  checkLike(username,name, i){
    console.log(username, name, i);
  
    this.userService.setLike(this.onGetAllCollectionsResponse.bind(this), username, name);
  
  }
  ngOnInit() {
  }

}