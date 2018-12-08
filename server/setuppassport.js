var passport = require('passport'),
	localStrategy = require('passport-local').Strategy,
	User = require('../models').User;

module.exports = function(){
	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		})
	});

	passport.use('local-login', new localStrategy({
			passReqToCallback: true
		}, function(req, username, password, done){
			User.findOne({username:username}, function(err, user){
				if(err){return done(err);}

				if(!user){
					req.flash('loginError', 'Username or Password Incorrect');
					return done(null, false);
				}

				if(!user.validPassword(password)){
					req.flash('loginError', 'Username or Password Incorrect');
					return done(null, false);
				}
				
				return done(null, user);
			})
		})
	)
}