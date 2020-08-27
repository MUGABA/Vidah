const jwt = require('jsonwebtoken')
const config = require('config')
const Joi =  require('joi')
const bcrypt = require('bcrypt')
const {User} = require('../models/user')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) =>{

	const { error } = validate(req.body)
	if(error)return res.status(400).send(error.details[0].message);

	let user = await User.findOne({email:req.body.email});
	if(!user)return res.status(400)
		.send({message:'Wrong email or password'});

	const isValid = await bcrypt.compare(req.body.password, user.password);
	if(!isValid)return res.status(400)
		.send({message:'Wrong email or password'});

	const token = user.generateAuthToken();
  	res.send({token:token})
});

validate = (login) =>{
	const schema = {
		email:Joi.string().required().email(),
		password:Joi.string().min(6).required()
	}
	return Joi.validate(login, schema)
}
module.exports = router