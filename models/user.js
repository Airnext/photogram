var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	bcrypt = require('bcrypt-nodejs');
	
var UserSchema = new Schema({
	username: {type: String},
	password: {type: String},
	bio: {type: String},
	createdAt: {type: Date, 'default':Date.now}
});

UserSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);