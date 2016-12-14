// grab the articles as a json
$.getJSON("/articles", function(data) {
	// for each one
	for (var i = 0; i < data.length; i++) {
		// display information on the page
		$("#articles").append("<p data-id'" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
	}
});


// when a p tag is clicked