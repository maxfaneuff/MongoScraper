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
  setTimeout(function() {
    request(
      "https://www.axios.com/",
      function(error, response, html) {
        if (!error) {
          //send the request body to cheerio
          var $ = cheerio.load(html);

          $("article").each(function(i, element) {
            //   console.log("---------------");
            //   console.log(element);
            var result = {};
            // grab title and link of article
            result.title = $(this)
              .find("h3")
              .text();
            wholeBody = $(this)
              .find("p")
              .text();
            //   title.addClass("href", link);
            // console.log(title);
            var bodyLength = 200;
            result.body = wholeBody.substring(0, bodyLength) + "...";

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
      },
      3000
    );
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
