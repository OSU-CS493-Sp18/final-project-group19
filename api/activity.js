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
router.put('/:businessID', function (req, res, next) {
  const mysqlPool = req.app.locals.mysqlPool;
  const businessID = parseInt(req.params.businessID);
  if (validation.validateAgainstSchema(req.body, businessSchema)) {
    replaceBusinessByID(businessID, req.body, mysqlPool)
      .then((updateSuccessful) => {
        if (updateSuccessful) {
          res.status(200).json({
            links: {
              business: `/businesses/${businessID}`
            }
          });
        } else {
          next();
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: "Unable to update specified business.  Please try again later."
        });
      });
  } else {
    res.status(400).json({
      error: "Request body is not a valid business object"
    });
  }
});

exports.router = router;
//exports.getBusinessesByOwnerID = getBusinessesByOwnerID;
