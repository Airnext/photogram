var Model = require('../models'),
	async = require('async');

module.exports = {
	newest: function(callback){
		Model.Comment.find({},{},{limit:5, sort:{timestamp:-1}}, function(err, comments){
			if(err){throw err;}
			
			var attachImage = function(comment, next){
				Model.Image.findOne({_id:comment.image_id},function(err, image){
					if(err){throw err;}
					
					comment.image = image;
					next(err);
				});
			}
			
			async.each(comments, attachImage, function(err){
				if(err){throw err;}
				
				callback(null, comments);
			})
		})
	}
}