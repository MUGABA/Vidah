const winston = require('winston')
const mongoose = require('mongoose')
const config = require('config')
module.exports = ()=>{
	const db = config.get('db')
	mongoose.connect(db,{ useNewUrlParser: true })
		.then(()=> console.log(`connected to ${db}...`))
	mongoose.set('useCreateIndex', true);
}