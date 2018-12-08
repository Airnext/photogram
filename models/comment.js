var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId =  Schema.ObjectId;
	
var CommentSchema = new Schema({
	image_id: {type: ObjectId},
	name: {type: String},
	email: {type: String},
	comment: {type: String},
	gravatar: {type: String},
	timestamp: {type: Date, 'default':Date.now}
});

CommentSchema.virtual('image').set(function(image){
	this.comment_image = image;
}).get(function(){
	return this.comment_image;
});

module.exports = mongoose.model('Comment', CommentSchema);