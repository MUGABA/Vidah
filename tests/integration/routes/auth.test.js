const req = require('supertest')
const bcrypt = require('bcrypt')
const {User} = require('../../../models/user')


describe('User login',()=>{
	beforeEach(()=>{server = require('../../../index');})
	afterEach(async ()=>{
		await server.close();
		await User.deleteMany({})
	});
	describe('/login',()=>{
			//Moshy methods
		let email;
		let password;
		let user;
		// utility function
		const exec = async ()=>{
			return await req(server)
			.post('/api/auth')
			.send({email,password});
		}
		beforeEach(async ()=>{ 

			user = new User({name:'Rashid'
				,email:'mug@gmail.com',
				password:'Rashid'});
			const salt = await bcrypt.genSalt(10)
			user.password = await bcrypt.hash(user.password, salt)
			await user.save()
		})

		it('should return 400 if any login requrements is not ',async ()=>{
			email = ''
			password = 'Rashid'
			res = await exec()

			expect(res.status).toBe(400);
		});
		it('should return 400 if email does not exist',async ()=>{
			email='ras@gmail.com'
			password= 'Rashid'

			res = await exec();
			// change something
			expect(res.status).toBe(400);
		});
		it('should return 400 if password does not match user password',async ()=>{
			email = 'mug@gmail.com'
			password = 'rashid'
			res = await exec()

			expect(res.status).toBe(400);
		});
		it('should return 200 if both email and password are valid',async ()=>{
			email = 'mug@gmail.com'
			password = 'Rashid'
			
			res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('token')
		});
	})
})