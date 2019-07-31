const error = require('../middleware/error')
const genres = require('../routes/genres')
const customers = require('../routes/customers')
const movies = require('../routes/movies')
const users = require('../routes/users')
const rentals = require('../routes/rentals')
const auth = require('../routes/auth')
const express = require('express')
const helmet = require('helmet')

module.exports=(app)=> { 
	app.use(express.json())
	app.use(helmet()) 
	app.use(express.urlencoded({ extended : true}))
	app.use('/api/genres',genres)
	app.use('/api/customers', customers)
	app.use('/api/movies', movies)
	app.use('/api/rentals', rentals)
	app.use('/api/users', users)
	app.use('/api/auth', auth)
	app.use(error)
}

// registering routes in the main app
