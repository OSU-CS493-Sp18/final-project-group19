const router = require('express').Router();
const crypto = require('crypto');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://mongo:27017/";
const jwt = require('jsonwebtoken');
const secret = "badsecret!";

router.get('/', function (req, response) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("users").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        response.send(result);
      });
    });
});


router.post('/', function (req, response) {
    username = req.body.username;
    password = req.body.password;
    var salt = crypto.randomBytes(16).toString('hex');
    hashedpass = crypto.createHash('md5').update(password + salt).digest("hex");
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("mydb");
	  var myobj = { username: username, password: hashedpass, salt: salt };
	  dbo.collection("users").insertOne(myobj, function(err, res) {
		if (err) throw err;
		console.log("user created");
		db.close();
		response.send("user created!");
	  });
	});
});

router.post('/login', function (req, response) {
    username = req.body.username;
    password = req.body.password;
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("users").findOne({username: username}, function(err, result) {
        if (err) throw err;
        console.log(result.username);
        db.close();
    	if(result.password.toString('hex') == crypto.createHash('md5').update(password + result.salt).digest("hex").toString('hex')){
			var token = jwt.sign({user: username}, secret);
			response.send(token);
		}
		else{
			response.send("login failed!");
		}
      });
    });
});

exports.router = router;
