const req = require('supertest')
const mongoose= require('mongoose')
const {User} = require('../../../models/user')


let server
let res;
describe('/api/users',()=>{
	beforeEach(()=>{server = require('../../../index');})
	afterEach(async ()=>{
		await server.close();
		await User.deleteMany({})
	});


	describe('POST /',()=>{
		let name
		let email
		let password
		let user
		let token
		const exec = async ()=>{
			return await req(server)
			.post('/api/users')
			.send({name,email,password});
		}
		beforeEach(async ()=>{ 
			user = new User({name:'Rashid',email:'mug@gmail.com',password:'Rashid'})
			await user.save()

			token = new User().generateAuthToken()
		})

		it('should return 200 if customer attributes are valid and return customer in the body',async ()=>{
			name = 'Rashid'
			email = 'ras@gmail.com'
			password = 'Rashid'

			res = await exec()

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('_id')
			expect(res.body).toHaveProperty('name')
			expect(res.body).toHaveProperty('email')
		});
		it('should return 400 if email already exists',async ()=>{
			name = 'Rashid'
			email = 'mug@gmail.com'
			password = 'Rashid'

			res = await exec();

			expect(res.status).toBe(400);
		});
		it('should return 400 if any required attribute is not given',async ()=>{
			name = ''
			email = 'ras@gmail.com'
			password = 'Rashid'
			res = await exec();

			expect(res.status).toBe(400);
		});
		it('should return 200 and a token in the header',async ()=>{
			name = 'Rashid'
			email = 'ras@gmail.com'
			password = 'Rashid'

			res = await exec()

			expect(res.status).toBe(200);
			expect(res.header).toHaveProperty('x-access-token')

		});
	})
	

	
	describe('GET/',()=>{
		let id;
		let token;
		const exec = async ()=>{
			return await req(server)
			.get('/api/users/me')
			.set('x-access-token',token)
			.send();
		}
		beforeEach( async ()=>{ 


			const user = new User({name:'Rashid',
				email:'ras@gmail.com',
				password:'Rashid'})
			await user.save()
			token = new User(user).generateAuthToken()
		});
		it('should return a user that is logged in', async ()=> {

			res = await exec() 

			expect(res.status).toBe(200)
			expect(res.body).toHaveProperty('_id')
			expect(res.body).toHaveProperty('name')


		});
	});
	
});