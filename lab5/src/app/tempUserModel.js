// JavaScript File
// lab5/src/app/tempUserModel.js

nev.generateTempUserModel(User);
 
// using a predefined file 
var TempUser = require('./app/tempUserModel');
nev.configure({
    tempUserModel: TempUser
}, function(error, options){
});

// get the credentials from request parameters or something 
var email = "...",
    password = "...";
 
var newUser = User({
    email: email,
    password: password
});
 
nev.createTempUser(newUser, function(err, existingPersistentUser, newTempUser) {
    // some sort of error 
    if (err)
        // handle error... 
 
    // user already exists in persistent collection... 
    if (existingPersistentUser)
        // handle user's existence... violently. 
 
    // a new user 
    if (newTempUser) {
        var URL = newTempUser[nev.options.URLFieldName];
        nev.sendVerificationEmail(email, URL, function(err, info) {
            if (err)
                // handle error... 
 
            // flash message of success 
        });
 
    // user already exists in temporary collection... 
    } else {
        // flash message of failure... 
    }
});