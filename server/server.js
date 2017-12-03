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

// call the packages we need
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

router.route('/create')

    .post(function(req,res){
        console.log(req);
        var email = req.body.email; 
        console.log(email);
        if(!validator.isEmail(email) || email == ""){
            return res.send({message: "invalid email"}); 
        }
        var psw = req.body.psw; 
        if(psw == ""){
            return res.send({message: "enter password"}); 
        }
        //encrypting the password 
        var salt = bcrypt.genSaltSync(saltRounds);  
        var hash = bcrypt.hashSync(psw, salt); 
        
        var code = randomstring.generate(); 
        
        
        var newAccount = new Account({
            email : email, password: hash, code : code, loggedIn : false 
        });
        
        //if the account is already in use
        Account.find({'email':email}, function(err, account){
            if(account[0] == null){
                //if the account isnt in use make one
                newAccount.save(function(err){
                    if(err){
                        res.send(err); 
                    }
                    res.json({message: 'Account created'}); 
                });
            }else{
                res.send({message: 'email already in use!'});
            }
            if(err){
                res.send(err); 
            }
        });
        
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
        const {code} = req.body; 

        //find the account which matches the code
        Account.find({code : code}, (err, acc)=>{
            if(err){
                return res.send(err); 
            }
            if(acc[0] == null){
                return res.send({message:'no user found!'}); 
            }
            
            acc[0]['loggedIn'] = true; 
            acc[0]['code'] = ''; 
            
            acc[0].save((err)=> {
                if(err){
                    return res.send(err); 
                }
                return res.send({message: 'verification success'}); 
            });
        }); 
    }); 

    // .get(function(req,res){
    //     console.log(req.protocol+":/"+req.get('host'));
    //     if((req.protocol+"://"+req.get('host'))==("http://"+host))
    //     {
    //         console.log("Domain is matched. Information is from Authentic email");
    //         if(req.query.id==rand)
    //         {
    //             console.log("email is verified");
    //             res.end("<h1>Email "+mailOptions.to+" is been Successfully verified");
    //         }
    //         else
    //         {
    //             console.log("email is not verified");
    //             res.end("<h1>Bad Request</h1>");
    //         }
    //     }
    //     else
    //     {
    //         res.end("<h1>Request is from unknown source");
    //     }
    // })

router.route('/login')

    .post(function(req, res){
        
        var email = req.body.email;
        var psw = req.body.psw;
        
        if(psw == ""){
            return res.json({message: 'Password is invalid'}); 
        }
        
        if(email == "admin" && psw == "admin") {
            res.send({message:'admin', email:'admin'});
        }
        
        Account.find({email:email}, function(err, account){
            //checking for the username 
            if(account[0] == null){
                return res.json({message: 'Username is invalid'}); 
            }
            //validating password
            var valid = bcrypt.compareSync(psw, account[0]['password']);
            if(!valid){
                return res.json({message: 'Password is invalid'}); 
            }
            //checking if the account has been verified 
            if(!(account[0]['loggedIn'])){
                return res.json({message: 'You must verify your account'}); 
            }
            
            if(err){
                return res.send(err); 
            }
            
            res.send({message:'success', email: account[0]['email']}); 
            
        }); 
    });
    
router.route('/createCollection')

    .post(function(req, res){
        
        var user = req.body.user, name = req.body.name, desc = req.body.desc;    
        
        Collection.find({ user : user, name : name}, function(err, collections){
            
            if(err){
                return res.send(err);
            }
            if(!(collections[0]==null)){
                return res.json({message: "You already have a collection with that name"}); 
            }
            
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
        
        var user = req.body.user;
        console.log(user);
        Collection.find({user : user}, (err, col)=>{
            if(err){
                return res.send(err);
            }
            console.log(col);
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
        
        var user = req.body.user, img = req.body.img, name = req.body.name; 
        Collection.find({user : user, name : name}, (err, col)=>{
            
            if(err){
                return res.send(err); 
            }
            if(col[0] == null){
                return res.send({message : "no collection"}); 
            }
            
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
        var user = req.body.user, img = req.body.img, name = req.body.name;
        Collection.find({user : user, name : name}, (err, col)=>{
            
            if(err){
                return res.send(err); 
            }
            
            const index = col[0]['images'].indexOf(img);
            console.log("image", img);
            
            if(col[0] == null){
                return res.send({message : "no collection"}); 
            }
            console.log(col);
            
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
        Collection.remove({_id: req.params.id}, (err, col)=> {
            if (err) {
                return res.send(err);
            }
            return res.send({message : "success"}); 
        })
    })

router.route('/saveCollection')

    .put((req, res)=> {
        var user = req.body.user, oldname = req.body.oldname, name = req.body.name, desc = req.body.desc;
        
        console.log('server oldname & user', oldname, user);
        Collection.find({user : user, name : oldname}, (err, col)=>{
            if(err){
                return res.send(err); 
            }
            
            col[0]['desc'] = desc;
            col[0]['name'] = name;
            col[0].save((err)=>{
                if(err){
                    return res.send(err); 
                }
                return res.send({message : "success"}); 
            }); 
        });
    })
    
router.route('/updatePrivacy')
    
    .put((req, res)=>{
        
        var type = req.body.type, user = req.body.user, name = req.body.name; 
        console.log(req.body); 
        Collection.find({name : name, user : user }, (err, col) =>{
            if(err){
                return res.send(err); 
            }
            
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
         Collection.find({'user':req.body.userCollection,'name': req.body.name }, function(err, collection){
            console.log('Collection[0]:',collection)
            if (err) {
                res.send(err);
            }
            var index = collection[0].rank.indexOf(req.body.userAccount);
            if (index > -1) {
                collection[0].rank.splice(index, 1);
            }else{
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