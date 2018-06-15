const router = require('express').Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://mongo:27017/";
var jwt = require('jsonwebtoken');
const secret = "badsecret!";

router.get('/', function (req, response) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("log").find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        response.send(result);
      });
    });
});



/*
 * Route to create a new activity.
 */
router.post('/', function (req, response) {
    name = req.body.name;
    unit = req.body.unit;
    time = new Date();
    if (!req.headers.authorization) {
	response.send('no auth token!');
	}
	token = req.headers.authorization.slice(7); 
      	console.log(token); 
	var decoded = jwt.verify(token, secret);
	console.log(decoded)
	username = decoded.user;
	
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myobj = { name: name, unit: unit, time: time, username:username };
      console.log(myobj);
      dbo.collection("log").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
        response.send("log posted!");
      });
    });
});


exports.router = router;
