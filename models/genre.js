const mongoose = require('mongoose')
const Joi = require('joi')


const genreschema = new mongoose.Schema({
	name:{
		type:String,
		required:true,
		minlength:5,
		maxlength:200
	}
});

const Genre = new mongoose.model('Genre', genreschema);


function validateGenre(genre){
	const schema = {
		name:Joi.string().min(5).max(50).required()
	}
	return Joi.validate(genre, schema)
}
module.exports.Genre = Genre
module.exports.validate = validateGenre