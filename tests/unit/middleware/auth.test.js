const {User} = require('../../../models/user');
const auth = require('../../../middleware/auth')
const mongoose = require('mongoose')

describe('Auth middleware population',()=>{
	it('it should return the payload in the req.user when the token is valid',()=>{
		const id = mongoose.Types.ObjectId().toHexString()
		const user = {
			_id:id,
			isAdmin:true
		};
		const token = new User(user).generateAuthToken();
		const req = {
			header: jest.fn().mockReturnValue(token)
		}
		const res = {}
		const next = jest.fn()
		auth(req,res,next);
		expect(req.user).toMatchObject(user)
	})
})