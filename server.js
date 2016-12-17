// DEPENDENCIES
// ===============================================
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");


// SETUP EXPRESS SERVER
// ==============================================
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));


// MONGOOSE DATABASE CONFIGURATION
// ==============================================
// local MongoDB
var databaseuri = "mongodb://localhost/news";

// if Heroku mLab exists, use Heroku app
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI);
}
// else, use local machine
else {
  mongoose.connect(databaseuri);
}
// ======================= end database configuration =======================


var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// ROUTES
// ==============================================
// simple index route
app.get("/", function(req, res) {
  res.send(index.html);
});

// GET request to scrape the website
app.get("/scrape", function(req, res) {
  // First, grab the body of the html with request
  request("http://www.theonion.com/section/entertainment/", function(error, response, html) {
    // set domain to variable
    var domain = "http://www.theonion.com/section/entertainment";
    // Then, load html into cheerio and save it to $
    var $ = cheerio.load(html);
    // Now, we grab elements with headline class and
    $(".headline").each(function(i, element) {
	    // create an empty result object
	    var result = {};
	    // add the text and href of every link, and save them as properties of the result object
	    result.title = $(this).children("a").attr("title");
      result.link = domain + $(this).children("a").attr("href");
      // create a new entry using Article model
      // this passes the title and link to entry
      console.log(result);
      var entry = new Article(result);


      // if the link of the article is NOT in db, save entry to db
      // --------------------------------------


      entry.save(function(err, doc) {
        // log errors
        if (err) {
          console.log(err);
        }
        // or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });
  // tell browser scrape complete
  res.send("Scrape Complete");
});



// get articles scraped from mongoDB
app.get("/articles", function(req, res) {
  // grab every doc in Articles array
  Article.find({}, function(error, doc) {
    // log errors
    if (error) {
      console.log(error);
    }
    // send doc to browser as json object
    else {
      res.json(doc);
    }
  });
});


// grab article by it's ObjectID
app.get("/articles/:id", function(req, res) {
  // use id passed in id parameter, prepare query that finds matching one in db
  Article.findOne({ "_id": req.params.id })
  // ... and populate all of the notes associated with it
  .populate("note")
  // execute our query
  .exec(function(error, doc) {
    // log errors
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});


// create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  console.log("line 127" + req.params.id)
  // create a new note and pass the req.body to entry
  var newNote = new Note(req.body);
  // save the new note to db
  newNote.save(function(error, doc) {
    // log errors
    if (error) {
      console.log(error);
    }
    else {
      // use article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // execute the above query
      .exec(function(err, doc) {
        // log errors
        if (err) {
          console.log("line 142" + err);
        }
        else {
          // send document to the browser
          res.send(doc);
        }
      });
    }
  }); 
});


// DEFINE PORT AND START SERVER LISTEN
// ==============================================
app.listen(3000, function() {
  console.log("App running on port 3000!");
});