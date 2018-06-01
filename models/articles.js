var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },

  body: {
    type: String,
    required: true
  },

  isSaved: {
    type: Boolean
  },
  altImg: {
    type: String
  },
  headlineImg: {
    type: String
  },
  note: [
    {
      type: Schema.Types.ObjectId,
      ref: "Notes"
    }
  ]
});

var Articles = mongoose.model("Articles", ArticleSchema);

module.exports = Articles;
