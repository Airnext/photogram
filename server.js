var express = require('express'),
	app = express(),
	config = require('./server/configure'),
	mongoose = require('mongoose');
	
app.set('port', process.env.PORT || 5000);
app.set('views', __dirname + '/views');

app = config(app);

mongoose.connect('mongodb://Airnext:4hoto_Gram@candidate.0.mongolayer.com:11254,candidate.45.mongolayer.com:11864/app117870959');
//mongodb://<user>:<password>@candidate.0.mongolayer.com:11254,candidate.45.mongolayer.com:11864/app117870959
//mongoose.connect('mongodb://localhost/photogram');
mongoose.connection.on('open', function(){
	console.log('Mongoose Connected');
});

var server = app.listen(app.get('port'), function(){
	console.log('Server started at localhost:' + app.get('port'));
});

require('./server/chat_server.js').initialize(server);