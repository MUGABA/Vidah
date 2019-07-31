
const express = require('express')
const config = require('config')
const app = express()
require('./startup/errors')()
require('./startup/routes')(app)
require('./startup/db')()

if(!config.get('SECRET_KEY')){
	console.log('FATAL ERROR! SECRET_KEY is not defined');
	process.exit(1);
}

// module.exports = {
//   testEnvironment: 'node'
// };
const port = process.env.PORT || 3000
const server =  app.listen(port, ()=> console.log(`listening to port ${port}`))

module.exports = server
