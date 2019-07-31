// routes for a customer
const _ = require('lodash')
const {Customer, validate} = require('../models/customer')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()


router.post('/',async (req,res)=>{
	const{error} = validate(req.body);
	if(error)return res.status(400).send(error.details[0].message);

	let customer = new Customer(_.pick(req.body,['name','phone']))
	const result = await customer.save();
	res.send(_.pick(customer,['_id','name','phone']));
});
//getting all customers
router.get('/', async (req, res) =>{
	const customers = await Customer.find().sort('name');
	res.send(customers);
});
//geting specific customer
router.get('/:id',async (req,res)=>{
	const customer = await Customer.findById(req.params.id);
	if(!customer)return res.status(404).send({message:"customer is not found"});

	res.send(customer)

});
// updating a customer
router.patch('/:id',async (req,res)=>{
	const{error} = validate(req.body);
	if(error)return res.status(400).send(error.details[0].message);

	const customer = await Customer.findById(req.params.id);
	if(!customer)return res.status(404).send({message:"customer is not found"});

	customer.name = req.body.name
	customer.phone = req.body.phone

	const result = await customer.save()
	res.send({
		message:'you just updated a customer',
		customer:customer
	});
});
//deleting a customer
router.delete('/:id', async (req,res)=>{

	const customer = await Customer.findById(req.params.id);
	if(!customer)return res.status(404).send({message:"customer is not found"});

	const result = await Customer.deleteOne(customer);
	res.send({
		message:'delete a customer with detalis!..',
		customer:result});

});

module.exports = router