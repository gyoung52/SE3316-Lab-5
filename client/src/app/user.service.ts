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

//for creating an account
    postData(callback_fun, email, psw){
        console.log(email, psw);
        this.http.post('/api/create', {'email' : email, 'psw' : psw}).subscribe(data=>{
            callback_fun(data['message']);
        }); 
    }

//validates account 
    postValidate(callback_fun, email, psw){
        this.http.post('/api/login', {'email' : email, 'psw' : psw}).subscribe(data=>{
            console.log(data);
            //special case for admin login
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

//sends verification code
    verifyEmail(callback, code){
        this.http.post('/api/verify', {'code': code}).subscribe(data=>{
            callback(data['message']); 
        });
    }

//sends the user, name of the collection and the collection description to the server to create a new collection
    createCollection(callback_fun, name, desc){
        this.http.post('/api/createCollection', {'name' : name, 'desc' : desc, user : localStorage.getItem('user')}).subscribe(data=>{
            callback_fun(data['message']);
        }); 
    }

//sends the email of the user to the server to retrieve their collections
    getCollections(callback, user){
        this.http.post('/api/getCollections', { 'user' : user }).subscribe(data=>{
            console.log(data);
            callback(data);
        }); 
    }

//sends image to with the collection info to the server to be added
    addtoCollection(user, img, name){
        this.http.post('/api/addtoCollection', { 'user' : user, 'img' : img, 'name' : name}).subscribe(data=>{
            console.log(data); 
        });
    }

//sends image and information about the collection it is being removed from to the server
    deletefromCollection(user, img, name){
        this.http.post('/api/deletefromCollection', {'user': user, 'img': img, 'name': name}).subscribe(data=>{
            console.log(data);
        });
    }

//Sends collection id to be deleted to the server
    delCol(id) {
        console.log('service user & name:')
        this.http.delete('/api/deleteCollection'+ id).subscribe(data=>{
        console.log(data);
     });
    }

//Sends the old name of the collection, the new name, the user to which the collection belongs, and the description of the collection to the server
    saveCol(oldname, name, value, user) {
        this.http.put('/api/saveCollection', {'oldname': oldname, 'user': localStorage.getItem('user'), 'name': name, 'desc': value}).subscribe(data=>{
            console.log(data);
        });
    }

//Sends the privacy status, the name of the collection and the user to which it belongs to the server
    changePrivacy(type, user){
        this.http.put('/api/updatePrivacy', {type : type, user: user.user, name: user.name }).subscribe(data=>{
            console.log(data); 
        }); 
    }

//Sends the user to which the liked collection belongs, the name of the collection and the name of the user who like the collection to the server
    setLike(callback_fun, user, name){
        this.http.put('/api/addLike', { 'userCollection' : user,  'name' : name, 'userAccount' : localStorage.getItem('user')}).subscribe(data=>{
            console.log('DATA:',data);
            callback_fun(data);
        });
    }

//Sends the user that is accessing the homepage to the user (authenticated users only)
    getHomeCollections(callback){
        this.http.post('/api/getEveryCollection', { 'user' : localStorage.getItem('user') }).subscribe(data=>{
            console.log(data);
            callback(data);
        }); 
    }
    
//Gets every collection from the server (unauthenticated users only)
    getUnauthHomeCollections(callback){
        this.http.post('/api/getEveryCollection', {}).subscribe(data=>{
            console.log(data);
            callback(data);
        }); 
    }
    
//Gets every collection (public or private) from every user (admin only)
    getAdminCollections(callback){
     this.http.post('/api/getEveryCollection', {}).subscribe(data=>{
         console.log(data);
        callback(data);
     }); 
    }
 
}