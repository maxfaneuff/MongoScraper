console.log("working");

$.getJSON("/scrape/", function(data) {
  console.log(data);
  for (var i = 0; i < data.length; i++) {
    var newWell = $("<div class='panel panel-info'></div>");
    newWell.text(data[i].title);
    $(".articles-well").append(newWell);
  }
});

$(document).on("click", ".article-scraper", function() {
  $(".articles-well").empty();
  $.ajax({
    method: "GET",
    url: "/articles/"
  }).then(function(dbArticle) {
    for (var i = 0; i < dbArticle.length; i++) {
      var newWell = $("<div class='panel panel-info'>");
      var newHeading = $("<div class='panel-heading'>");
      var newTitle = $("<h3 class='panel-title'>");
      var newBody = $("<div class='panel-body'>");
      var closeDiv = $("</div>");

      newTitle.text(dbArticle[i].title);
      newBody.text(dbArticle[i].body);
      newHeading.append(newTitle);
      newWell.append(newHeading);
      newWell.append(newBody);

      $(".articles-well").append(newWell);
    }
  });
});
