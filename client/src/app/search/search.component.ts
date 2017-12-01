import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import {SearchService} from '../search.service'; 
import * as $ from 'jquery';
import {UserService} from '../user.service'; 

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  
  photoCollection = [];
  collections = []; 
  isCollection = false; 
  res = ''; 
  @ViewChild('rankedCollections') rankedCollections: ElementRef;
  
  constructor(private _service : SearchService, private userService: UserService) { }

  ngOnInit() {
    this.userService.getCollections(this.loadCollections.bind(this), localStorage.getItem('user'));
  }
  
  loadCollections(data){ 
    for(var i = 0; i < data.length; i++){
      this.collections.push(data[i]['name']); 
      this.isCollection = true; 
    }
    console.log(this.collections); 
  }

  searchImages(keyWord: string){
    this._service.getSearchData(this.onSearchResponse.bind(this), keyWord);
  }
  
  onSearchResponse(res: string){
    this.photoCollection = new Array();
      for(var i =0; i < res.length; i++){
        if (res[i]['links'] != null){
          if (res[i]['links'][0]['render'] == "image"){
            this.photoCollection.push(res[i]['links'][0]['href']);
          }
        }
    }
    this.rankedCollections.nativeElement.innerHTML = "";
    for (var i = 0; i < this.photoCollection.length ; i++){
      $('#pictures').append("<li style='float:left;padding: 0.5cm 0.25cm 0.5cm 0.25cm;' >"
      + "<img id="+i+" style='height:400px; width: 400px' src ='" 
      + this.photoCollection[i] + "'></li>");
      $("#"+i).click({img:$("#"+i).attr('src')}, this.imgClick); 
    }
  }
  
  
  imgClick(event){
    if(($('#wrap').children().length) > 0){
      $('#selectedImg').attr('src', event.data.img); 
      $('#myModal').css('display', 'block'); 
    }
  }
  
  close(){
    $('#myModal').css('display', 'none');
  }
  
  addPic(){
    console.log($('#wrap input[name=collection]:checked').val());
    $('#myModal').css('display', 'none');
    this.userService.addtoCollection(localStorage.getItem('user'),  $('#selectedImg').attr('src'), $('#wrap input[name=collection]:checked').val()); 
  }

}