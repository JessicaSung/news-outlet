// grab the articles as a json
$.getJSON("/articles", function(data) {
	// for each one
	for (var i = 0; i < data.length; i++) {
		// display information on the page
		$("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
	}
});


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
			// input to enter new title
			$("#notes").append("<input id='titleinput' name='title' >");
			// textarea to add a new note body
			$("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
			// button to submit a new note, with article id saved to it
			$("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
			// if there's a note already for that article, it will show up
			$("#titleinput").val(data.note[0].title);
			$("#bodyinput").val(data.note[0].body);



			// for (var i = 0; data.note[0])
			// if (data.note) {
				// ------------ write code to pull notes from database here ---------------
				// for (var i = 0; i < data.length; i++) {
				// 	var title = data.notes[i].title;
				// 	var body = data.notes[i].body;
				// }
				// $("#titleinput").append(title);
				// $("#bodyinput").append(body);
			// }
		});
});


// when you click the savenote button
$(document).on("click", "#savenote", function() {
	// grab id associated with article from submit button
	var thisId = $(this).attr("data-id");
	// POST request to change the note using user input
	$.ajax({
		method: "POST",
		url: "/articles/" + thisId,
		data: {
			// value taken from title input
			title: $("#titleinput").val(),
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
	$("#titleinput").val("");
	$("#bodyinput").val("");
});