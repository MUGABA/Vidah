const {User} = require('../../../models/user')
const {Genre} = require('../../../models/genre')

const req = require('supertest')


describe('Auth middleware',()=>{
	beforeEach(()=>{server = require('../../../index');})
	afterEach(async ()=>{
		server.close();
		await Genre.deleteMany()
	});
	let server;
	let token;
	let res;
	const exec=()=>{
		return req(server)
			.post('/api/genres')
			.set('x-access-token',token)
			.send({name:'genre1'});
	}
	beforeEach(()=>{
		const user = new User()
			user.isAdmin = true
		token = new User(user).generateAuthToken()
	})
	it('should return 401 if the token is not provided',async ()=>{
		token = ''
		res = await exec()
		expect(res.status).toBe(401)
	})
	it('should return 400 if the token is invalid',async ()=>{
		token = 'a'
		res = await exec()
		expect(res.status).toBe(400)
	})
	it('should return 200 if the token is okey',async ()=>{
		res = await exec()

		expect(res.status).toBe(200)
	})
})
