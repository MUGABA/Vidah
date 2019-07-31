require('express-async-errors')
const winston = require('winston')
// require('winston-mongodb')
const mongoose = require('mongoose')

module.exports = ()=>{
		//hundling uncought rejections on node not express
	process.on('UncaughtException', (ex)=>{
		winston.error(error.message, ex)
		process.exit(1)
	})
	// hundling uncought promise rejections
	process.on('UnhandledRejection', (ex)=>{
		winston.error(error.message, ex)
		process.exit(1)
	})

	//using winston to log errors to the file
	let logger = winston.createLogger({
		transports:[

		new winston.transports.File({filename:'errorlog.log'})]
		// This would work for logging errors to the database
		// new winston.transports.mongoDB({db:'mongodb://localhost:27017/vidal',level:'error'})]
	});
	if (process.env.NODE_ENV === 'development') {
	  logger.add(new winston.transports.Console({
	    format: winston.format.simple()
	  }));
	}
}