const {Rental} = require('../models/rental')
const express = require('express')
const router = express.Router()

router.post('/', (req,res)=>{
	res.status(401).send('Unauthorised User')
});

module.exports = router;