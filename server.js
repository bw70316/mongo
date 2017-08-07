var express = require("express");
var mongoose = require("mongoose")
var bodyParser = require("body-parser");
var cheerio = require("cheerio");
var request = require("request");

var Comments = require("./models/comments.js");
var Article = require("./models/Article.js")

var app = express();

mongoose.Promise = Promise;

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static("public"));


// mongoose.connect("mongodb://localhost/scrape")

mongoose.connect("mongodb://heroku_bbz9x4c0:5cvi0t2uep4fqj7q8m5fc4pbjj@ds157682.mlab.com:57682/heroku_bbz9x4c0")
var db = mongoose.connection;


db.on("error", function(error) {
  console.log("Mongoose Error:", error);
});

db.once("open", function() {
	console.log("Mongoose connection successful.")
});

// Routes
// ======


app.get("/scrape", function(req, res) {

  request("http://www.theonion.com/section/politics/", function(error, response, html) {
    
    var $ = cheerio.load(html);
    
    $("article h2").each(function(i, element) {

      var result = {};

      
      result.headline = $(this).children("a").text();
      result.link = $(this).children("a").attr("href");

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      
      entry.save(function(err, doc) {
       
        if (err) {
          console.log(err);
        }
  
        else {

          console.log(doc);
        }
      });

    });
  });

  
  res.send("Scrape Complete");
});

app.get("/articles", function(req, res) {
  
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});



app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the commentss associated with it
  .populate("comments")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

app.post("/articles/:id", function(req, res) {
  // Create a new comments and pass the req.body to the entry
  var newComments = new Comments(req.body);

  // And save the new comments the db
  newComments.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's comments
      Article.findOneAndUpdate({ "_id": req.params.id }, { "comments": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});

app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newComments = new Comments(req.body);

  // And save the new note the db
  newComments.delete(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.remove({ "_id": req.params.id }, { "comments": doc._id })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("App running on port " + port);
});