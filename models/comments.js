var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentsSchema = new Schema({

	headline: {
		type: String
	},

	body: {
		type: String
	}
});

var Comments = mongoose.model("Comments", CommentsSchema);

module.exports = Comments;