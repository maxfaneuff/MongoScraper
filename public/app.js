console.log("working");

$.getJSON("/scrape/", function(data) {
  console.log("-------------->" + data);
});

//a route for clearing the articles collection.  I'm using it mostly for development
$(document).on("click", ".article-clean", function() {
  $.ajax({
    method: "DELETE",
    url: "/remove/"
  }).then(function(db) {
    $(".articles-well").empty();
    $("#dbArticle").text(db);

    $("#myModal").modal({
      show: true,
      keyboard: true,
      backdrop: true
    });
  });
});

//a route to set isSaved to true when a save button is clicked on
$(document).on("click", "#save", function() {
  var dataId = $(this).attr("data-id");

  console.log(dataId);
  $.ajax({
    method: "PUT",
    url: "/articles/" + dataId
  }).then(function(data) {
    $("#dbArticle").text(data);
    $("#myModal").modal({
      show: true,
      keyboard: true,
      backdrop: true
    });
  });
});

$(document).on("click", "#home", function() {
  $(".articles-well").empty();
  getScraped();
});

//an event handler to perform a scrape, and then generate HTML to make the db info show up in the appropriate format
$(document).on("click", ".article-scraper", function() {
  $(".articles-well").empty();

  $.ajax({
    method: "GET",
    url: "/scrape/"
  }).then(function(data) {
    $("#dbArticle").text(data);
    $("#myModal").modal({
      show: true,
      keyboard: true,
      backdrop: true
    });
    getScraped();
  });
});

//an event handler to display saved articles
$(document).on("click", "#savedArticles", function() {
  getSaved();
});

//an event handler to remove an article from the saved articles
$(document).on("click", ".deleteBtn", function() {
  console.log("del click");
  var dataId = $(this).attr("data-id");

  console.log(dataId);
  $.ajax({
    method: "POST",
    url: "/saved/" + dataId
  }).then(function(data) {
    $("#dbArticle").text(data);
    $("#myModal").modal({
      show: true,
      keyboard: true,
      backdrop: true
    });
  });
  getSaved();
});

$(document).on("click", ".noteBtn", function() {
  thisId = $(this).attr("data-id");
  console.log(thisId);
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(dbArticle) {
    console.log(dbArticle);
    $("#noteBody").empty();
    $("#noteTitle").text("Note For:  " + dbArticle.title);
    if (dbArticle.note !== undefined) {
      for (var i = 0; i < dbArticle.note.length; i++) {
        var newWell = $('<div class="well">');
        var noteText = $("<span>" + dbArticle.note[i].body + "</span>");
        var delNote =
          '<button class="btn btn-danger note-delete" data-id="' +
          dbArticle.note[i]._id +
          '">x</button>';
        newWell.append(noteText);
        newWell.append(delNote);
        $("#noteBody").prepend(newWell);
      }
    }
    $("#saveNote").attr("data-id", thisId);
    $("#noteModal").modal({
      show: true,
      keyboard: true,
      backdrop: true
    });
  });
});

//When the delete button is clicked, delete the note
$(document).on("click", ".note-delete", function() {
  var thisId = $(".note-delete").attr("data-id");
  console.log(thisId);
  $.ajax({
    method: "POST",
    url: "/notes/" + thisId
  }).then(function(data) {
    console.log(data);
    $("#noteModal").modal("hide");
  });
});

//When the save note button is clicked, save the note & hide the modal
$(document).on("click", "#saveNote", function() {
  var newNote = $("#noteForm")
    .val()
    .trim();
  var thisId = $("#saveNote").attr("data-id");
  console.log(newNote);
  console.log(thisId);
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      body: newNote,
      article: thisId
    }
  }).then(function(data) {
    console.log(data);
    $("#noteModal").modal("hide");
  });
});

function getScraped() {
  $.ajax({
    method: "GET",
    url: "/articles/"
  }).then(function(dbArticle) {
    for (var i = 0; i < dbArticle.length; i++) {
      console.log(dbArticle[i]);
      //make a new well for the article
      var newWell = $("<div class='panel panel-info'>");
      //a new heading for the title
      var newHeading = $("<div class='panel-heading'>");
      //where the title goes
      var newTitle = $("<span class='panel-title col-lg-10'>");
      //where the article body goes
      var newBody = $("<div class='panel-body'>");
      // the save button
      var saveBtn = $(
        '<button type="button" class="btn btn-danger col-lg-2" id="save">Save Article</button>'
      );
      var closeDiv = $("</div>");
      // the image for the article, w/ the src tag generated from the dbArticle info
      var articleImage = $(
        "<img src=" +
          dbArticle[i].headlineImg +
          'alt="articleImg" height="300px" width="600px">'
      );
      //adding the objectId for each article to the save button
      saveBtn.attr("data-id", dbArticle[i]._id);
      //an if/else statement I had to write b/c the format of the webpage differs w/ how it handles images
      if (dbArticle[i].headlineImg !== undefined) {
        articleImage.attr("src", dbArticle[i].headlineImg);
      } else {
        articleImage.attr("src", dbArticle[i].altImg);
      }
      //attach the article title to the appropriate div
      newTitle.text(dbArticle[i].title);
      //ditto for the article body
      newBody.text(dbArticle[i].body);
      //append the article title to the heading div
      newHeading.append(newTitle);
      //append the save button to the heading div
      newHeading.append(saveBtn);
      //append all that to the well
      newWell.append(newHeading);
      //add the article body to the bottom of the well
      newWell.append(newBody);
      // add the article image below all that
      newWell.append(articleImage);

      //all of the articles generated above gets appended to the right spot on the page
      $(".articles-well").append(newWell);
    }
  });
}

function getSaved() {
  $.ajax({
    method: "GET",
    url: "/saved/"
  }).then(function(dbArticle) {
    console.log(dbArticle);
    $(".articles-well").empty();
    for (var i = 0; i < dbArticle.length; i++) {
      //make a new well for the article
      var newWell = $("<div class='panel panel-info'>");
      //a new heading for the title
      var newHeading = $("<div class='panel-heading'>");
      //where the title goes
      var newTitle = $("<span class='panel-title'>");
      //where the article body goes
      var newBody = $("<div class='panel-body'>");
      var closeDiv = $("</div>");
      // the image for the article, w/ the src tag generated from the dbArticle info
      var articleImage = $(
        "<img src=" +
          dbArticle[i].headlineImg +
          'alt="articleImg" height="300px" width="600px">'
      );
      //an if/else statement I had to write b/c the format of the webpage differs w/ how it handles images
      if (dbArticle[i].headlineImg !== undefined) {
        articleImage.attr("src", dbArticle[i].headlineImg);
      } else {
        articleImage.attr("src", dbArticle[i].altImg);
      }

      var delBtn = $(
        '<button type="button" class="btn btn-warning deleteBtn">Delete Saved</button>'
      );
      var addNote = $(
        '<button type="button" class="btn btn-success noteBtn">Add Note</button>'
      );

      delBtn.attr("data-id", dbArticle[i]._id);
      addNote.attr("data-id", dbArticle[i]._id);

      //attach the article title to the appropriate div
      newTitle.text(dbArticle[i].title);
      //ditto for the article body
      newBody.text(dbArticle[i].body);
      //append the article title to the heading div
      newHeading.append(newTitle);
      //add delete button to heading
      newHeading.append(delBtn);
      //add Add Note button to heading
      newHeading.append(addNote);
      //append all that to the well
      newWell.append(newHeading);
      //add the article body to the bottom of the well
      newWell.append(newBody);
      // add the article image below all that
      newWell.append(articleImage);

      $(".articles-well").append(newWell);
    }
    // $(".articles-well").append(newWell);
  });
}

$("#noteModal").on("hidden.bs.modal", function() {
  $(this)
    .find("form")[0]
    .reset();
});
