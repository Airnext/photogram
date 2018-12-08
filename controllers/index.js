var ImageModel = require('../models').Image,
	User = require('../models').User,
	sidebar = require('../helpers/sidebar');

module.exports = {
	login_signup: function(req, res){
		
		var viewModel = {
			images:[]
		}
		
		ImageModel.find({},{},{limit:5, sort:{views:-1}}, function(err, images){
			if(err){throw err;}

			viewModel.images = images;
			viewModel.loginError = req.flash('loginError');
			viewModel.loginSuccess = req.flash('loginSuccess');
			viewModel.signupError = req.flash('signupError');
			viewModel.signupSuccess = req.flash('signupSuccess');
			viewModel.errors = req.session.errors;
			viewModel.input = req.session.inputs;
			res.render('login_signup',viewModel)
			req.session.errors = null;
			req.session.inputs = null;
		});	
	},
	index: function(req, res){
		
		var viewModel = {
			images:[]
		}
		
		var count = 0;
		ImageModel.find({},{},{sort:{timestamp:-1}}, function(err, images){
			if(err){throw err;}
			if(images){
				for(image in images){
					count = count + 0.3;
					images[image].delay = count;
				}
			}

			viewModel.images = images;
			viewModel.user = req.user;
			
			ImageModel.find({views:0},function(err, noviews){
				if(err){throw err;}

				viewModel.new = noviews.length;
				viewModel.noviews = noviews;

				sidebar(viewModel, function(viewModel){
					res.render('index',viewModel);
				})
			})
		});	

	},
	signup: function(req, res){
		var username = req.body.username;
		var password = req.body.password;
		var bio = req.body.biography;
		
		User.findOne({ username: username }, function(err, user) {
			if(err){ throw err; }
			if(user){
				req.flash("signupError", "User already exists");
				return res.redirect("/");
			}

			req.check('username', 'Username cannot be empty').notEmpty().trim().escape();
			req.check('username', 'Only Letters are allowed for Username').matches(/[a-zA-Z]*\s[a-zA-Z]*/).trim().escape();
			req.check('username', 'Username must be at least 2 characters').isLength({min:2}).trim().escape();

			req.check('password', 'Password cannot be empty').notEmpty().trim().escape();
			req.check('password', 'Password must be at least 8 characters').isLength({min:8}).trim().escape();
			req.check('password', 'Only Letters and Numbers are allowed for Password').isAlphanumeric().trim().escape();



			var errors = req.validationErrors();
			if(errors){
				req.session.errors = errors;
				req.session.inputs = req.body;
				res.redirect('/');
			}else{
				req.flash("signupSuccess", "User created Successfully");
				res.redirect('/');	
			}
			
			// var newUser = new User();
			
			// newUser.username = username;
			// newUser.bio = bio;
			// newUser.password = newUser.encryptPassword(password);
			
			// newUser.save(function(err){
			// 	if(err){throw err;}
			 	// req.flash("signupSuccess", "User created Successfully");
				//res.redirect('/');	
			// });
	 	});
	},
	logout:function(req, res){
		req.logout();
		res.redirect("/");
	},
	chatroom: function(req, res){

		var viewModel = {}
			
			
		ImageModel.find({views:0},function(err, noviews){
			if(err){throw err;}

			viewModel.user = req.user;
			viewModel.new = noviews.length;
			viewModel.noviews = noviews;

			sidebar(viewModel, function(viewModel){
				res.render('chatroom',viewModel);
			})
		});
	},
	profile: function(req, res){
		console.log(req.user.username);

		var viewModel = {}

		User.findOne({ username: req.user.username }, function(err, user) {
			if(err){ throw err; }
			console.log(user);
			viewModel.user = user;

			res.render('profile', viewModel);

	 	});

		
	}
}