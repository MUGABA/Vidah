const {User,validate} = require('../models/user')
const auth = require('../middleware/auth')
const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()


router.post('/', async (req, res) =>{

	const { error } = validate(req.body)
	if(error)return res.status(400).send(error.details[0].message);

	let user = await User.findOne({email:req.body.email});
	if(user)return res.status(400).send({message:'user already registered: try login!'});
	// using lodash
	user = new User(_.pick(req.body, ['name','email', 'password']));
	const salt = await bcrypt.genSalt(10)
	user.password = await bcrypt.hash(user.password, salt)
	await user.save()
	payload = {
		'_id':user._id,
		'isAdmin':user.isAdmin
	}
	const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
})

router.get('/me',  auth,async (req,res) =>{
	const user = await User.findById(req.user._id).select('-password')
	res.status(200).send(_.pick(user,['_id','name','email']))
})
module.exports = router