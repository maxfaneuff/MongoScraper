var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var cheerio = require("cheerio");
var request = require("request");
var axios = require("axios");

// Require all models
var db = require("./models");

var PORT = 3000;

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
mongoose.connect("mongodb://localhost/mongoScraper");

// Routes
// app.get("/", function(req, res) {
//   res.send("Hello World!");
// });

app.get("/scrape/", function(req, res) {
  request("https://www.axios.com/", function(error, response, html) {
    //send the request body to cheerio
    var $ = cheerio.load(html);

    $(".story-card").each(function(i, element) {
      // grab title and link of article
      var title = $(element)
        .find("h3")
        .text();
      var body = $(element)
        .find("p")
        .text();
      //   title.addClass("href", link);
      console.log(title);

      // send those things to the db w/ Articles model
      db.Articles.create(
        {
          title: title,
          body: body
        },
        function(err, inserted) {
          if (err) {
            console.log(err);
          } else {
            console.log(inserted);
          }
        }
      );
    });
    res.send("Scrape Complete!");
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

app.post("/articles/:id", function(req, res) {});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});