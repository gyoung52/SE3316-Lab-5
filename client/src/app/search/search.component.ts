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
  
  pageNum = 0;
  numOfPages = 0;
  spill = 0;
  pages = [[],[],[],[], [], []];
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
    
    this.pages = [[],[],[],[],[]];
    //this.pages = new Array(Array());
    if (res.length % 20 == 0) {
      this.numOfPages = res.length/20;
      this.spill = 0;
    } else {
      this.numOfPages = res.length/20 + 1;
      this.spill = res.length%20;
    }
    console.log('Response length',res.length)
    console.log('Num of pages & spill:',this.numOfPages, this.spill)
    for (var i = 0; i < this.numOfPages; i++) {
      var pageLength = 20;
      if (i == this.numOfPages-1 && this.spill !== 0) {
        pageLength = this.spill;
      }
      console.log('i:',i);
      for(var j = 0; j < pageLength; j++){
        console.log('j:',j);
        //console.log(this.photoCollection);
        if (res[j+(i*20)]['links'] != null){
          if (res[j+(i*20)]['links'][0]['render'] == "image"){
            //this.pages[i][j].push(res[j]['links'][0]['href']);
            console.log('pages:',this.pages);
            this.pages[i][j] = (res[j+(i*20)]['links'][0]['href']);
          }
        }
      }
      //console.log('pages at i:',this.pages[i]);
      //(this.pages[i]).push(this.photoCollection);
    }
    this.rankedCollections.nativeElement.innerHTML = "";
    for (var j = 0; j < this.pages[0].length ; j++){
      $('#pictures').append("<li style='float:left;padding: 0.5cm 0.25cm 0.5cm 0.25cm;' >"
      + "<img id="+j+" style='height:400px; width: 400px' src ='" 
      + this.pages[0][j] + "'></li>");
      $("#"+j).click({img:$("#"+j).attr('src')}, this.imgClick); 
    }
  }
  
  pageUpClick(event){
    if (this.pageNum !== (this.numOfPages-1)){
      this.pageNum++;
      this.rankedCollections.nativeElement.innerHTML = "";
      for (var j = 0; j < this.pages[this.pageNum].length ; j++){
        $('#pictures').append("<li style='float:left;padding: 0.5cm 0.25cm 0.5cm 0.25cm;' >"
        + "<img id="+j+" style='height:400px; width: 400px' src ='" 
        + this.pages[this.pageNum][j] + "'></li>");
        $("#"+j).click({img:$("#"+j).attr('src')}, this.imgClick); 
      }
    }
  }
  
  pageDownClick(event){
    if (this.pageNum !== 0){
      this.pageNum--;
      this.rankedCollections.nativeElement.innerHTML = "";
      for (var j = 0; j < this.pages[this.pageNum].length ; j++){
        $('#pictures').append("<li style='float:left;padding: 0.5cm 0.25cm 0.5cm 0.25cm;' >"
        + "<img id="+j+" style='height:400px; width: 400px' src ='" 
        + this.pages[this.pageNum][j] + "'></li>");
        $("#"+j).click({img:$("#"+j).attr('src')}, this.imgClick); 
      }
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