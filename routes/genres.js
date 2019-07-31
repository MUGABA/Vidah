const {Genre, validate} = require('../models/genre')
const validId = require('../middleware/validateobjectid')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const mongoose = require('mongoose')
const express = require('express')
const router = express.Router()


//post route to create a genre
router.post('/',[auth, admin],async (req, res) =>{
	const{error} = validate(req.body);
	if(error)return res.status(400).send(error.details[0].message);
	// recieving from a ui
	let genre = new Genre({
		name: req.body.name
	});

	genre = await genre.save();

	res.send(genre);
});
// get route get all the genres
router.get('/', async (req, res)=>{
	const genres = await Genre.find().sort('name')
	res.send(genres);
});
// route to find a single genre
router.get('/:id',validId, async (req, res) =>{
	const genre = await Genre.findById(req.params.id)
	if(!genre)return res.status(404).send({message:"genre of that id not found"});

	res.status(200).send(genre);
});
// route for updating.
router.put('/:id',[auth,validId],async (req, res) =>{
	// Initialising the eror using joi
	const{error} = validate(req.body);
	if(error)return res.status(400).send(error.details[0].message);
	//checking for the genre by the id 
	const genre = await Genre.findById(req.params.id)
	if(!genre)return res.status(404)
		.send({message:'genre your trying to update doesnot exist'});
	//setting value to new value given
	genre.name = req.body.name
	const result = await genre.save()
	res.send({
		message:'you updated a genre',
		genre:genre
	});
})
// route for deleting
router.delete('/:id',[auth, admin, validId], async (req, res) =>{
	//checking for the genre by the id 

	const genre = await Genre.findById(req.params.id)
	if(!genre)return res.status(404)
		.send({message:'genre your trying to delete doesnot exist'});

	await Genre.deleteOne(genre)

	res.send({message:`you deleted a genre`,
			genre:genre})
});
module.exports = router