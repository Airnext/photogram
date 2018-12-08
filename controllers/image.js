var path = require('path'),
	fs = require('fs'),
	Model = require('../models'),
	md5 = require('md5'),
	sidebar = require('../helpers/sidebar'),
	nodemailer = require('nodemailer');

module.exports = {
	index: function(req, res){
		var viewModel = {
			image:{},
			comments:[]
		}
		
		Model.Image.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
			if(err){throw err;}
			
			if(image){
				image.views = image.views + 1;
				image.save();
				viewModel.image = image;
				
				Model.Comment.find({image_id:image._id},function(err, comments){
					if(err){throw err;}
					
					viewModel.comments = comments;
					viewModel.user = req.user;
					
					sidebar(viewModel, function(viewModel){
						res.render('image', viewModel);
					});
				});
			}else{
				res.redirect('/');
			}
	
		});
		
	},
	create: function(req, res){
		function saveImage(){
			var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
				imgUrl = '';
				
			for(i=0; i<6; i++){
				imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));
			}
			
			Model.Image.find({filename:imgUrl}, function(err, images){
				if(err){throw err;}
				
				if(images.length > 0){
					saveImage();
				}else{
					
					var tempPath = req.file.path,
					ext = path.extname(req.file.originalname).toLowerCase(),
					targetPath = path.resolve('./public/upload/' + imgUrl + ext);
				
					if(ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif'){
						fs.rename(tempPath, targetPath, function(err){
							if(err){throw err;}
							
							Model.User.findOne({name:req.user.name},function(err, user){

								var newImg = new Model.Image({
									filename: imgUrl + ext,
									title: req.body.title,
									description: req.body.description
								});

								newImg.user_id = user._id;
								
								newImg.save(function(err){
									if(err){throw err;}
									
									//res.json({likes: image.likes});
									res.redirect('/logged');
								});
							
							})
							
						});
					}else{
						fs.unlink(tempPath, function(err){
							if(err){throw err;}
							
							//res.json({error: Invalid Image Format});
							res.status(500).send('Error: Invalid Image Format.');
						});
					}
					
				}
			})
		}
		saveImage();
	},
	like:function(req, res){
		Model.Image.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
			if(!err && image){
				image.likes = image.likes + 1;
				image.save(function(err){
					if(err){
						res.json(err)
					}else{
						res.json({likes: image.likes});
					}
				});
			}else{
				res.redirect('/');
			}
		})
	},
	comment:function(req, res){
		Model.Image.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
			if(!err && image){
				
				var newComment = new Model.Comment(req.body);
				newComment.image_id = image._id;
				newComment.gravatar = md5(newComment.email);
				
				newComment.save(function(err, comment){
					if(err){throw err;}
					
					res.redirect('/image/' + image.uniqueId + '#' + comment._id);
				});
				
			}else{
				res.redirect('/');
			}
		})
	},
	remove: function(req, res){
		Model.Image.findOne({filename:{$regex:req.params.image_id}}, function(err, image){
			if(err){throw err;}
			
			fs.unlink(path.resolve('./public/upload/' + image.filename),function(err){
				
				Model.Comment.remove({image_id:image._id},function(err){
					if(err){throw err;}
					
					image.remove(function(err){
						if(err){
							res.json(false)
						}else{
							res.json(true)
						}
					});
				})
			})
		});
	},
	sendMail:function(req, res){
		var transporter = nodemailer.createTransport({
		    service:'Gmail',
		    auth: {
		        user: "akhidenorernestium@gmail.com",
		        pass: "*************"
		    }
		});

		// setup email data with unicode symbols
	    var mailOptions = {
	        from: '"Ernest" <akhidenorernestium@gmail.com>', // sender address
	        to: 'sheyions4real@yahoo.co.uk', // list of receivers
	        subject: 'Send Email Using Node.js', // Subject line
	        text: 'Hello world? Node.js New world for me', // plain text body
	        html: '<b>Hello world?</b> <b>Node.js New world for me</b>' // html body
	    };

	    // send mail with defined transport object
	    transporter.sendMail(mailOptions, (error, info) => {
	        if (error) {
	        	//res.json(false);
	        	res.redirect('/logged');
	        	console.log('--------------An Error Occurred---------------');
	            return console.log(error);
	        }
	        console.log('--------------Info.messageId---------------');
	        console.log('Email Message sent: %s', info.messageId);

	        transporter.close();
	        console.log('--------------transporter Closed---------------');
	        res.redirect('/logged');
	        //res.json(true);
	    });
	}
}