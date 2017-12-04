import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; 

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }
  
 //this function recieves a callback function to send back 
 //asynchronous response from the server
 
 getData(callback_fun){
     this.http.get('/api').subscribe(data=>{
        callback_fun(data['message']);
     }); 
 }
 
 postData(callback_fun, email, psw){
     console.log(email, psw);
     this.http.post('/api/create', {'email' : email, 'psw' : psw}).subscribe(data=>{
        callback_fun(data['message']);
     }); 
 }
 
 postValidate(callback_fun, email, psw){
     this.http.post('/api/login', {'email' : email, 'psw' : psw}).subscribe(data=>{
         console.log(data); 
        if (data['message'] == 'admin') {
            localStorage.setItem('user', 'admin');
        }
        if(data['email'] != null){
            callback_fun(data['message']); 
            localStorage.setItem('user', JSON.stringify(data['email']));
            console.log(localStorage.getItem('user'));
        }
        else{
            callback_fun(data['message']);
        }
     }); 
 }
 
 verifyEmail(callback, code){
     this.http.post('/api/verify', {'code': code}).subscribe(data=>{
        callback(data['message']); 
     });
 }
 
 createCollection(callback_fun, name, desc){
     this.http.post('/api/createCollection', {'name' : name, 'desc' : desc, user : localStorage.getItem('user')}).subscribe(data=>{
        callback_fun(data['message']);
     }); 
 }
 
 getCollections(callback, user){
     this.http.post('/api/getCollections', { 'user' : user }).subscribe(data=>{
         console.log(data);
        callback(data);
     }); 
 }
 
 addtoCollection(user, img, name){
     this.http.post('/api/addtoCollection', { 'user' : user, 'img' : img, 'name' : name}).subscribe(data=>{
        console.log(data); 
     });
 }
 
 deletefromCollection(user, img, name){
     console.log('service user & name:',user, name);
     this.http.post('/api/deletefromCollection', {'user': user, 'img': img, 'name': name}).subscribe(data=>{
         console.log(data);
     });
 }
 
    delCol(id) {
        console.log('service user & name:')
        this.http.delete('/api/deleteCollection'+ id).subscribe(data=>{
        console.log(data);
     });
    }
 
 saveCol(oldname, name, value, user) {
     console.log('service', oldname);
    this.http.put('/api/saveCollection', {'oldname': oldname, 'user': localStorage.getItem('user'), 'name': name, 'desc': value}).subscribe(data=>{
        console.log(data);
    });
 }
 
 changePrivacy(type, user){
     console.log(user);
     this.http.put('/api/updatePrivacy', {type : type, user: user.user, name: user.name }).subscribe(data=>{
        console.log(data); 
    }); 
 }
 
setLike(callback_fun, user, name){
    this.http.put('/api/addLike', { 'userCollection' : user,  'name' : name, 'userAccount' : localStorage.getItem('user')}).subscribe(data=>{
    console.log('DATA:',data);
    callback_fun(data);
    })
    }
    
    getHomeCollections(callback){
     this.http.post('/api/getEveryCollection', { 'user' : localStorage.getItem('user') }).subscribe(data=>{
         console.log(data);
        callback(data);
     }); 
    }
    
    getUnauthHomeCollections(callback){
     this.http.post('/api/getEveryCollection', {}).subscribe(data=>{
         console.log(data);
        callback(data);
     }); 
    }
    
    getAdminCollections(callback){
     this.http.post('/api/getEveryCollection', {}).subscribe(data=>{
         console.log(data);
        callback(data);
     }); 
    }
 
}