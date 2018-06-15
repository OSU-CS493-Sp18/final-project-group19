const router = require('express').Router();
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://mongo:27017/";

router.get('/', function (req, response) {
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("activity").find({}).toArray(function(err, result) {
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
    type = req.body.type;
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      var myobj = { name: name, type: type };
      console.log(myobj);
      dbo.collection("activity").insertOne(myobj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        db.close();
        response.send("activity posted!");
      });
    });
});


/*
 * Route to fetch info about a specific activity.
 */
router.get('/:activity', function (req, response) {
    const name = req.params.activity;
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("mydb");
      dbo.collection("activity").find({name: name}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        response.send(result);
      });
    });
});


/*
 * Route to replace data for a business.
 */
router.put('/', function (req, response) {
	name = req.body.name;	
	type = req.body.type;
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("mydb");
	  var myquery = { name: name };
	  var newvalues = { $set: {type: type } };
	  dbo.collection("activity").updateOne(myquery, newvalues, function(err, res) {
	    if (err) throw err;
	    console.log("1 document updated");
	    db.close();
		response.send("activity updated!");
	  });
	});
});

router.delete('/', function (req, res, next) {
	name = req.body.name;
	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("mydb");
	  var myquery = { name: name };
	  dbo.collection("activity").deleteOne(myquery, function(err, obj) {
	    if (err) throw err;
	    console.log("1 document deleted");
	    db.close();
		res.send("activity deleted!");
	  });
});
});
exports.router = router;
//exports.getBusinessesByOwnerID = getBusinessesByOwnerID;
