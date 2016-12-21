// DISPLAYS ARTICLES ON PAGE
// ===============================================
// grab the articles as a json
$.getJSON("/articles", function(data) {
	// for each one
	for (var i = 0; i < data.length; i++) {
		// display information on the page
		$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br /><a href='" + data[i].link + "' target='_blank'>" + data[i].link + "</a></p>");
	}
});


// DISPLAYS COMMENT BOX FOR SPECIFIC ARTICLE
// ===============================================
// when a p tag is clicked
$(document).on("click", "p", function() {
	// empty notes in notes section
	$("#notes").empty();
	// save id from p tag
	var thisId = $(this).attr("data-id");
	// ajax call the Article
	$.ajax({
		method: "GET",
		url: "/articles/" + $(this).attr("data-id")
	})
		// add note information to the page
		.done(function(data) {
			console.log("line 26", data);
			// title of the article
			$("#notes").append("<h2>" + data.title + "</h2>");
			// textarea to add a new note body
			$("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
			// button to submit a new note, with article id saved to it
			$("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
			// if there's a note already for that article, it will show up
			$("#bodyinput").val(data.note[0].body);
		});
});


// SAVES USER COMMENT TO DATABASE
// ===============================================
// when you click the savenote button
$(document).on("click", "#savenote", function() {
	// grab id associated with article from submit button
	var thisId = $(this).attr("data-id");
	// POST request to change the note using user input
	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			// value taken from note textarea
			body: $("#bodyinput").val()
		}
	})
		.done(function(data) {
			// log response
			console.log("line 64 server.js", data);
			// empty notes section
			$("#notes").empty();
		});
	// clear values in input and textarea for new note
	$("#bodyinput").val("");
});