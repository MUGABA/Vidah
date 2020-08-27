const {User} = require('../../models/user')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const config = require('config')
let result;
describe('generateAuthToken',()=>{
	it('should return a token to the user',()=>{
		payload = {
			_id: new mongoose.Types.ObjectId().toHexString(),
			isAdmin:true
		}
		const user = new User(payload)
		const token = user.generateAuthToken()
		const decoded = jwt.verify(token, config.get('SECRET_KEY'))
		expect(decoded).toMatchObject(payload)
	});
});