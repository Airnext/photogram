var Model = require('../models');

module.exports = {
	popular: function(callback){
		var count = 0;
		Model.Image.find({},{},{limit:9, sort:{likes:-1}},function(err, images){
			if(err){throw err;}
			if(images){
				for(image in images){
					count = count + 0.3;
					images[image].delay = count;
					console.log(count + " ====== " + images[image].delay);
				}
			}
			callback(null, images);
		})
	}
}