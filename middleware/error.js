const winston = require('winston')
module.exports = function (err, req, res, next){
	winston.error(error.message, err)
	res.status(500).send('Something happened unexpectedly')
}