console.log("working");

$.getJSON("/scrape/", function(data) {
  console.log("-------------->" + data);
});

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

// $(document).on("click", ".article-scraper", function() {
//   $(".articles-well").empty();
//   $.ajax({
//     method: "GET",
//     url: "/articles/"
//   }).then(function(dbArticle) {
//     for (var i = 0; i < dbArticle.length; i++) {
//       var newWell = $("<div class='panel panel-info'>");
//       var newHeading = $("<div class='panel-heading'>");
//       var newTitle = $("<h3 class='panel-title col-lg-10'>");
//       var newBody = $("<div class='panel-body'>");
//       var closeDiv = $("</div>");

//       newTitle.text(dbArticle[i].title);
//       newBody.text(dbArticle[i].body);
//       newHeading.append(newTitle);
//       newWell.append(newHeading);
//       newWell.append(newBody);

//       $(".articles-well").append(newWell);
//     }
//   });
// });

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
    $.ajax({
      method: "GET",
      url: "/articles/"
    }).then(function(dbArticle) {
      for (var i = 0; i < dbArticle.length; i++) {
        var newWell = $("<div class='panel panel-info'>");
        var newHeading = $("<div class='panel-heading'>");
        var newTitle = $("<h3 class='panel-title col-lg-8'>");
        var newBody = $("<div class='panel-body'>");
        var saveBtn = $(
          '<button type="button" class="btn btn-danger col-lg-2" id="save">Save Article</button>'
        );
        var closeDiv = $("</div>");

        newTitle.text(dbArticle[i].title);
        newBody.text(dbArticle[i].body);
        newHeading.append(newTitle);
        newHeading.append(saveBtn);
        newWell.append(newHeading);
        newWell.append(newBody);

        $(".articles-well").append(newWell);
      }
    });
  });
});
