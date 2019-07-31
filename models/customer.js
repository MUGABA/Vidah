const mongoose = require('mongoose')
const Joi = require('joi')



const customerSchema = new  mongoose.Schema({
	name:{
		type:String,
		minlength:5,
		maxlength:200,
		required:true
	},
	phone:{
		type:Number,
		required:true
	},
	isGold:{
		type:Boolean,
		default:false
		}
})

const Customer = mongoose.model('Customer', customerSchema)



function validateCustomer(customer){
	const schema = {
		name:Joi.string().min(5).max(200).required(),
		phone:Joi.string().min(5).max(15).required(),
		isGold:Joi.boolean()
	}
	return Joi.validate(customer, schema)
}
module.exports.Customer = Customer
module.exports.validate =validateCustomer 
