$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].headline + "<br />" + data[i].link + "</p>");
  }
});

$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })

  .done(function(data) {
      console.log(data);
      // The title of the article
      $("#comments").append("<h2>" + data.headline + "</h2>");
      // An input to enter a new title
      $("#comments").append("<input id='titleinput' name='headline' placeholder='Title'>");
      // A textarea to add a new note body
      $("#comments").append("<textarea id='bodyinput' name='body' placeholder='add comment here'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
      
      $("#comments").append("<button data-id='" + data._id + "' id='deletenote'>Delete Note</button>");

      // If there's a note in the article
      if (data.comments) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.comments.headline);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.comments.body);
      }
    });
});



$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      headline: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#comments").empty();
    });






$(document).on("click", "#deletenote", function() {

  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a DELETE request to delete the comment, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      'action': 'delete'
    }
  })
    // With that done
    .done(function(data) {
      // Log the response
      console.log(thisId);
      
    $("#comments").empty();
    });
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});