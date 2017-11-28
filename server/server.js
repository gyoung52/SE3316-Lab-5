var mongoose   = require('mongoose');
var bodyParser = require('body-parser');
var express    = require('express');        // call express
var bcrypt = require('bcrypt');
const saltRounds = 10;
var app        = express();                 // define our app using express
var path = __dirname;
var validator = require('validator');

mongoose.connect('mongodb://localhost:27017/Course', {
    useMongoClient: true,
});
mongoose.Promise = global.Promise;


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8081;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();

// get an instance of the express Router
app.use(express.static(__dirname));
router.use(function(req, res, next){
  next();
});
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    console.log("Sent index.html");
    res.json({message: 'Hello World'});
});


// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

router.route('/createaccount') 
    .post(function(req, res) {
        var salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(req.body.psw);
        
        if(validator.isEmail(re.body.email)) {
            account.email = req.body.email;
            account.password = hash;
            
            account.save(function(err) {
                if(err) {
                    re.send(err);
                }
                res.json({message: 'Account created'});
            });
        }
        else {
            res.json({message: 'Invalid email'}); 
        }
    });

router.route('/verify')
    .post(function(re, res) {
        Account.find({'email':req.body.email}, function(err, account) {
            if(account[0] == null) {
                res.json({message: 'invalid username'});
            }
            else {
                if (err) {
                    res.send(err);
                }
                var valid = bcrypt.compareSync(req.body.psw, account[0]['password']);
                console.log(valid);
                if (valid){
                    res.json({massage: 'valid password'});
                }
                else {
                    res.json({message: 'invalid password'});
                }
            }
        });
    });
    


// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);