var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  body: String,
  article: String
});

var Notes = mongoose.model("Notes", NoteSchema);

module.exports = Notes;
