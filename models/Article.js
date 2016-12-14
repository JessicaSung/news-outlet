// DEPENDENCIES
// ===============================================
var mongoose = require("mongoose");

// create schema class
var Schema = mongoose.Schema;

// create article schema
var ArticleSchema = new Schema({
	// title is a required string
	title: {
		type: String,
		required: true
	},
	// link is a required string
	link: {
		type: String,
		required: true
	},
	// this saves one note's ObjectID. ref refers to the Note model. This is the association.
	note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
});

// create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// export the model
module.exports = Article;