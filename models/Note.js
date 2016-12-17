// DEPENDENCIES
// ===============================================
var mongoose = require("mongoose");

// create a schema class
var Schema = mongoose.Schema;

// create the Note schema
var NoteSchema = new Schema({
	// just a string
	body: {
		type: String
	}
});

// Mongoose will automatically save the ObjectsId's of the notes
// these id's are referred to in the Article model

// create the Note model with the NoteSchema
var Note = mongoose.model("Note", NoteSchema);

// export the Note moel
module.exports = Note;