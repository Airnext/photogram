var express = require('express'),
	router = express.Router(),
	index = require('../controllers/index'),
	image = require('../controllers/image'),
	passport = require('passport'),
	isLogged = require('./islogged');

module.exports = function(app){
	router.get('/', index.login_signup);
	router.post('/image', image.create);
	router.get('/image/:image_id', isLogged, image.index);
	router.post('/image/:image_id/like', image.like);
	router.post('/image/:image_id/comment', image.comment);
	router.delete('/image/:image_id', image.remove);
	router.post('/signup', index.signup);
	router.post('/login', passport.authenticate('local-login', {
		successRedirect:'/logged',
		failureRedirect:'/',
		failureFlash:true
	}));
	router.get('/logged', isLogged, index.index);
	router.get('/logout', index.logout);
	router.get('/chat', index.chatroom);
	router.get('/profile', index.profile);
	router.get('/mail', image.sendMail);
	router.use(function(req, res){
		res.send('Route Not Found');
	})
	
	app.use(router);
}