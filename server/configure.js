var routes = require('./routes'),
	exphbs = require('express-handlebars'),
	express = require('express'),
	path = require('path'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	multer = require('multer'),
	errorHandler = require('errorhandler'),
	moment = require('moment'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	flash = require('express-flash'),
	passport = require('passport'),
	setUpPassport = require('./setuppassport'),
	favicon = require('serve-favicon'),
	expressValidator = require('express-validator'),
	mongoose = require('mongoose'),
	MongoStore = require('connect-mongo')(session);

module.exports = function(app){
	app.use(morgan('dev'));
	app.use(bodyParser.urlencoded({extended:false}));
	app.use(bodyParser.json());
	app.use(expressValidator());
	app.use(multer({dest:'./public/upload/temp'}).single('file'));
	app.use(cookieParser());
	app.use(session({
		secret: "TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX",
		resave: false,
		saveUninitialized: false,
		store: new MongoStore({mongooseConnection:mongoose.connection})
	}));
	app.use(flash());
	app.use(passport.initialize());
	app.use(passport.session());
	setUpPassport();
	app.use(favicon(path.join(__dirname, '../public', 'img', 'favicon.ico')));
	app.use('/public/', express.static(path.join(__dirname, '../public/')));
	routes(app);
	if('development' === app.get('env')){
		app.use(errorHandler());
	}
	app.engine('handlebars', exphbs.create({
		helpers:{
			timeago: function(timestamp){
				return moment(timestamp).startOf('minute').fromNow();
			}
		}
	}).engine);
	app.set('view engine', 'handlebars');
	return app;
}