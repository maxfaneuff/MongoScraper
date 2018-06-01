var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");
var axios = require("axios");

// Require all models
var db = require("./models");
console.log(db);
var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI);

// Routes
app.get("/", function(req, res) {
  res.send("Hello World!");
});

// to clear the database
app.delete("/remove/", function(req, res) {
  db.Articles.remove({})
    .then(function(stuff) {
      res.send("Fresh database");
    })
    .catch(function(error) {
      return res.json(error);
    });
});

app.get("/scrape/", function(req, res) {
  request("https://www.axios.com/", function(error, response, html) {
    if (!error) {
      //send the request body to cheerio
      var $ = cheerio.load(html);

      $("article").each(function(i, element) {
        //   console.log("---------------");
        //   console.log(element);
        var result = {};
        //a boolean value for whether or not an article is saved
        result.isSaved = false;
        // grab title of headline
        result.title = $(this)
          .find("h3")
          .text();
        // grab whole body of article text
        wholeBody = $(this)
          .find("p")
          .text();
        // grab image link
        result.headlineImg = $(this)
          .find("figure")
          .children()
          .find("img")
          .attr("data-src");
        result.altImg = $(this)
          .find("figure")
          .children()
          .find("img")
          .attr("src");
        //   title.addClass("href", link);
        // console.log(title);
        var bodyLength = 200;
        //Keep the length of the body of the article to just 200 characters
        result.body = wholeBody.substring(0, bodyLength) + "...";
        console.log(result);
        // send those things to the db w/ Articles model
        db.Articles.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(error) {
            return res.json(error);
          });
      });
      res.send("Scrape Complete!");
    }
  });
});

//a route to find an article by id, and set the isSaved value to true, so it'll appear in the Saved Articles list
app.put("/articles/:id", function(req, res) {
  db.Articles.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { isSaved: true } }
  )
    .then(function(stuff) {
      res.send("Article Saved!");
    })
    .catch(function(err) {
      res.json(err);
    });
});

//a route to find an article by _id, and set the isSaved value to false, so it won't appear in the Saved Articles list
app.post("/saved/:id", function(req, res) {
  db.Articles.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { isSaved: false } }
  )
    .then(function(stuff) {
      res.send("Article is No Longer Saved");
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/saved/", function(req, res) {
  // find all articles where isSaved = true, set by clicking on the save article button
  db.Articles.find({ isSaved: true })
    .then(function(dbArticle) {
      res.send(dbArticle);
    })
    .catch(function(error) {
      res.json(error);
    });
});

app.get("/articles", function(req, res) {
  // find all articles in the Articles collection
  db.Articles.find({})
    .then(function(dbArticle) {
      // send that info to the front end
      res.send(dbArticle);
    })
    .catch(function(err) {
      // stop if err
      res.json(err);
    });
});

//a route to get the notes of an article
app.get("/articles/:id", function(req, res) {
  var thisId = req.params.id;
  db.Articles.findOne({ _id: req.params.id })
    .populate({
      path: "note",
      match: { article: { $eq: thisId } }
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

//a route to make a new note
app.post("/articles/:id", function(req, res) {
  console.log(req.params.id);
  console.log(req.body);
  db.Notes.create(req.body)
    .then(function(dbNote) {
      return db.Articles.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { note: dbNote._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/notes/:id", function(req, res) {
  db.Notes.deleteOne({ _id: req.params.id })
    .then(function(dbNote) {
      console.log(dbNote);
      res.json(dbNote);
    })
    .catch(function(err) {
      res.json(err);
    });
});
// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
