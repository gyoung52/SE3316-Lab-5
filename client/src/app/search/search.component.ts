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
  
  pages = [][];
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
    var numOfPages;
    var spill;
    this.photoCollection = new Array();
    this.pages = new Array();
    if (res.length % 20 == 0) {
      numOfPages = res.length/20;
      spill = 0;
    } else {
      numOfPages = res.length/20 + 1;
      spill = res.length%20;
    }
    for (var i = 0; i < numOfPages; i++) {
      var pageLength = 20;
      if (i = numOfPages-1 && spill !== 0) {
        pageLength = spill;
      }
      for(var j =0; j < pageLength; j++){
        if (res[j]['links'] != null){
          if (res[j]['links'][0]['render'] == "image"){
            this.photoCollection.push(res[j]['links'][0]['href']);
          }
        }
      }
      this.pages.push(photoCollection);
    }
    this.rankedCollections.nativeElement.innerHTML = "";
    //for (var i = 0; )
    for (var j = 0; j < this.photoCollection.length ; j++){
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