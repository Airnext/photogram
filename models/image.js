var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId,
	path = require('path');
	
var ImageSchema = new Schema({
	filename: {type: String},
	title: {type: String},
	description: {type: String},
	likes: {type: Number, 'default':0},
	views: {type: Number, 'default':0},
	timestamp: {type: Date, 'default':Date.now},
	user_id:{type:ObjectId},
	delay: {type:Number, 'default':0}
});

ImageSchema.virtual('uniqueId').get(function(){
	return this.filename.replace(path.extname(this.filename), '');
});

module.exports = mongoose.model('Image', ImageSchema);