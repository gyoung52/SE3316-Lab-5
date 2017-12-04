// server.js

// BASE SETUP
// =============================================================================

var mongoose = require("mongoose");
var nodemailer = require('nodemailer'); 
var randomstring = require('randomstring');

var Account = require("./app/models/account"); 
var Collection = require("./app/models/collection"); 
 

mongoose.connect('mongodb://localhost:27017/sendit', { useMongoClient : true });
mongoose.Promise = global.Promise;

// call the required packages
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt'); 
const saltRounds = 10; 
var validator = require('validator'); 


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8081;        // set our port

//email account for verifying users/ administrative purposes
var smtpTransport = nodemailer.createTransport({
    service: "Gmail", 
    auth: {
        user: "gyoung52se3316@gmail.com",   
        pass: 'gr43m3y0ung'
    }
});

var rand,mailOptions,host,link;

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

router.use(function(req, res, next){
    console.log('Something is happening'); 
    next(); 
}); 

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'api created' });   
});

// more routes for our API will happen here


//Creates account
router.route('/create')

    .post(function(req,res){
        console.log(req);
        //getting password fromm service
        var email = req.body.email;
        console.log(email);
        //checks if the email is valid
        if(!validator.isEmail(email) || email == ""){
            return res.send({message: "Invalid email"});
        }
        
        //getting 
        var psw = req.body.psw;
        //ensures password is not empty
        if(psw == ""){
            return res.send({message: "Enter password"});
        }
        //encrypting password with bcrypt
        var salt = bcrypt.genSaltSync(saltRounds);  
        var hash = bcrypt.hashSync(psw, salt); 
        
        //generating random code for user verification
        var code = randomstring.generate(); 
        
        //creates new account instance
        var newAccount = new Account({
            email : email, password: hash, code : code, loggedIn : false 
        });
        
        //if email is already in use
        Account.find({'email':email}, function(err, account){
            if(account[0] == null){
                //if the email isnt in use go forward with crerating account
                newAccount.save(function(err){
                    if(err){
                        res.send(err); 
                    }
                    res.json({message: 'Account created'}); 
                });
            }else{
                res.send({message: 'Email already in use'});
            }
            if(err){
                res.send(err); 
            }
        });
        
        //sending confirmation email with verification code
        mailOptions={
            to : req.body.email,
            subject : "Please confirm your Email account",
            html : "Use this code to verify your email: " + newAccount.code
        };
        smtpTransport.sendMail(mailOptions, function(error, response){
             if(error){
                console.log(error);
                res.end("error");
             }else{
                res.end("email sent");
             }
        });
        
    })
    
    //gets accounts
    .get(function(req,res){
       Account.find(function(err, accounts){
           if(err){
               res.send(err); 
           }
          res.json(accounts); 
        });
    });
    
router.route('/verify') 

    .post((req, res) => {
        //getting code from body
        const {code} = req.body; 

        //find the account which matches the varification code
        Account.find({code : code}, (err, acc)=>{
            if(err){
                return res.send(err); 
            }
            
            //Checks if the account matching the code exists
            if(acc[0] == null){
                return res.send({message:'No user found'}); 
            }
            
            //else sets user to logged in
            acc[0]['loggedIn'] = true; 
            
            //sets verification code to empty string
            acc[0]['code'] = ''; 
            
            //saves account
            acc[0].save((err)=> {
                if(err){
                    return res.send(err); 
                }
                return res.send({message: 'verification success'}); 
            });
        }); 
    }); 

router.route('/login')

    .post(function(req, res){
        
        //getting email and password form service
        var email = req.body.email, psw = req.body.psw;
        
        //checks if password is empty
        if(psw == ""){
            return res.json({message: 'Password is invalid'}); 
        }
        
        //special case for admin login
        if(email == "admin" && psw == "admin") {
            res.send({message:'admin'});
        }
        else {//if admin credentials have not been entered
            Account.find({email:email}, function(err, account){
                
                //checking the username 
                if(account[0] == null){
                    return res.json({message: 'Username is invalid'}); 
                }
                
                //validating the password with bcrypt
                var valid = bcrypt.compareSync(psw, account[0]['password']);
                if(!valid){
                    return res.json({message: 'Password is invalid'}); 
                }
                
                //Confirming the account has been verified 
                if(!(account[0]['loggedIn'])){
                    return res.json({message: 'You must verify your account'}); 
                }
                
                if(err){
                    return res.send(err); 
                }
                
                res.send({message:'success', email: account[0]['email']}); 
                
            });
        }
    });
    
router.route('/createCollection')

    .post(function(req, res){
        
        //getting user, name and password form service
        var user = req.body.user, name = req.body.name, desc = req.body.desc;    
        
        //Checking if there is already a collection with the same name and user
        Collection.find({ user : user, name : name}, function(err, collections){
            
            if(err){
                return res.send(err);
            }
            if(!(collections[0]==null)){
                return res.json({message: "You already have a collection with the same name"}); 
            }
            
            //else creates a new collection and assigns the variables taken from the service
            var coll= new Collection();
            coll.user= user;
            coll.name= name;
            coll.desc = desc;
            coll.ispublic= false;
            coll.save(function(err){
                if(err)
                    return res.send(err);
                
                res.json({message: 'success'});
            });
            
        });
    });
    
router.route('/getCollections')
    
    .post((req, res)=> {
        //getting user from service
        var user = req.body.user;
        //finding all collections from that user
        Collection.find({user : user}, (err, col)=>{
            if(err){
                return res.send(err);
            }
            return res.send(col); 
            
        }); 
        
    })
    
    .get(function(req,res){
       Collection.find(function(err, accounts){
           if(err){
               res.send(err); 
           }
          res.json(accounts); 
        });
    });
    
router.route('/addtoCollection')

    .post((req, res)=>{
        //getting user, image and collection name from service
        var user = req.body.user, img = req.body.img, name = req.body.name; 
        
        //checks if collection exists
        Collection.find({user : user, name : name}, (err, col)=>{
            
            if(err){
                return res.send(err); 
            }
            
            if(col[0] == null){
                return res.send({message : "no collection"}); 
            }
            
            //else push image 
            col[0]['images'].push(img);
            col[0].save((err)=>{
                if(err){
                    return res.send(err);
                }
                return res.send({message : "success"}); 
            }); 
            
        }); 
        
    });
    
router.route('/deletefromCollection')

    .post((req, res)=> {
        //getting user, image, name of the collaction from service
        var user = req.body.user, img = req.body.img, name = req.body.name;

        //finding collection from user
        Collection.find({user : user, name : name}, (err, col)=>{
            console.log(col[0]);
            if(err){
                return res.send(err); 
            }
            
            //finding image in image array contained in collection
            const index = col[0]['images'].indexOf(img);
            console.log("image", img);
            
            //checking if collection exists
            if(col[0] == null){
                return res.send({message : "no collection"}); 
            }
            
            //check if the image exists on the collection
            if (index !== -1) {
                col[0]['images'].splice(index, 1);
            }
            
            col[0].save((err)=>{
                if(err){
                    return res.send(err); 
                }
                return res.send({message : "success"}); 
            }); 
            
        }); 
    })

router.route('/deleteCollection:id')

    .delete((req, res) => {
        
        //finding collection by id and deleting
        Collection.remove({_id: req.params.id}, (err, col)=> {
            if (err) {
                return res.send(err);
            }
            return res.send({message : "success"}); 
        })
    })

router.route('/saveCollection')

    .put((req, res)=> {
        //getting user the old name of the collection, the new name of the collection and the description of the collection
        var user = req.body.user, oldname = req.body.oldname, name = req.body.name, desc = req.body.desc;
        
        console.log('server oldname & user', oldname, user);
        Collection.find({user : user, name : oldname}, (err, col)=>{
            if(err){
                return res.send(err); 
            }
            
            //saving new name and description for collection
            col[0]['desc'] = desc;
            col[0]['name'] = name;
            col[0].save((err)=>{
                if(err){
                    return res.send(err); 
                }
                return res.send({message : "success"}); 
            }); 
        });
    });
    
router.route('/updatePrivacy')
    
    .put((req, res)=>{
        //getting privacy setting
        var type = req.body.type, user = req.body.user, name = req.body.name; 
        console.log(req.body);
        Collection.find({name : name, user : user }, (err, col) =>{
            if(err){
                return res.send(err); 
            }
            
            //set new privacy setting
            col[0].ispublic = type; 
            
            col[0].save((err)=>{
                if(err){
                    res.send(err); 
                }
                
                res.send({message : "success"}); 
            });
            
        });
    });
    
router.route('/getEveryCollection')
    
    .post((req, res)=> {
        //gets all collections
        Collection.find(function(err, col){
            if(err){
                return res.send(err);
            }
            console.log(col);
            return res.send(col); 
            
        }); 
        
    })
    
router.route('/addLike')

    .put(function(req,res){
        
        //finding liked collection
         Collection.find({'user':req.body.userCollection,'name': req.body.name }, function(err, collection){
            console.log('Collection[0]:',collection)
            if (err) {
                res.send(err);
            }
            
            //checking if this user has checked this box before
            var index = collection[0].rank.indexOf(req.body.userAccount);
            
            //if user has already liked this collection, remove them from liked array
            if (index !== -1) {
                collection[0].rank.splice(index, 1);
            }else{
                //if user has not liked collection add them to liked array 
                collection[0].rank.push(req.body.userAccount);
            }
            
              collection[0].save(function() {
                Collection.find(function(err, collections) {
                    if (err){
                        res.send(err);
                    }   
                    console.log(collections);
                    res.json(collections);
                });
            
            });
         });
       
    });

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Server is running on port: ' + port);