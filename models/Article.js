var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({

	headline: {
		type: String,
		required: true
	},

	link: {
		type: String,
		required: true
	},

	comments: {
		type: Schema.Types.ObjectId,
		ref: "Comments"
	}
  });

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;