const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose')
const Joi = require('joi')


const userSchema = new mongoose.Schema({
	name:{
		type:String,
		minlength:5,
		maxlength:40,
		trim:true
	},
	email:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		minlength:6,
		maxlength:200,
		required:true
	},
	isAdmin:Boolean
});

userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('SECRET_KEY'));
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user){
	const schema = {
		name:Joi.string().min(5).max(200).required(),
		email:Joi.string().required().email(),
		password:Joi.string().min(6).required()
	}
	return Joi.validate(user, schema)
}

module.exports.User = User
module.exports.validate = validateUser


