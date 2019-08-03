const req = require('supertest')
const mongoose= require('mongoose') 
const {Customer} = require('../../../models/customer')
const {User} = require('../../../models/user')

let server
let res;
describe('/api/customers',()=>{
	beforeEach(()=>{server = require('../../../index');})
	afterEach(async ()=>{
		await server.close();
		await Customer.deleteMany({})
	});
	
	describe('GET /',()=>{
		// utility function
		const exec = async ()=>{
			return await req(server)
			.get('/api/customers')
			.set('x-access-token',token)
			.send();
		}
		beforeEach( async ()=>{ 
			await Customer.collection.insertMany([
			{name:'Rashid',phone:'123456'},
			{name:'Dickson',phone:'2345687654'}
			])

			const user = new User()
			// user.isAdmin = true
			token = new User(user).generateAuthToken()
		})
		it('should return all customers in the database',async ()=>{

			res = await exec()

			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2)
			expect(res.body.some(customer => customer.name === 'Rashid')).toBeTruthy()
			expect(res.body.some(customer => customer.name === 'Dickson')).toBeTruthy()
		});
		
	})
	
	describe('GET/:id',()=>{
		let id;
		const exec = async ()=>{
			return await req(server)
			.get('/api/customers/' + id)
			.set('x-access-token',token)
			.send();
		}
		beforeEach( async ()=>{ 
			const customer = new Customer({name:'Rashid',phone:'123456'});
			await customer.save()
			id = customer._id
			const user = new User()
			// user.isAdmin = true
			token = new User(user).generateAuthToken()
		})
		it('should return a genre with a given id', async ()=> {
			res = await exec() 
			expect(res.status).toBe(200)
			expect(res.body).toHaveProperty('name','Rashid')
		});
		it('should return 404 if genre id is invalid', async ()=> {
			id = 1
			res = await exec()
			expect(res.status).toBe(404)
		});
		it('should return 404 if genre if that id is not found', async ()=> {
			id = mongoose.Types.ObjectId()
			res = await exec()
			expect(res.status).toBe(404)
		});
	});
	
	describe('POST /',()=>{
		//Moshy methods
		let name;
		let phone;
		// utility function
		const exec = async ()=>{
			return await req(server)
			.post('/api/customers')
			.send({name,phone});
		}
		beforeEach(async ()=>{ 
			let customer = new Customer({name,phone});
		})

		it('should return 200 if customer attributes are valid and return customer in the body',async ()=>{

			name = 'Rashid'
			phone = '123456'
			res = await exec()

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('name','Rashid')
			expect(res.body).toHaveProperty('phone')
		});
		it('should return 400 if customer.name&&phone has lessthan 5 characters',async ()=>{
			name='Rash'
			phone= '1234'

			res = await exec();
			// change something
			expect(res.status).toBe(400);
		});
		it('should return 400 if customer.name>50 && phone>15 characters respectively',async ()=>{
			name = new Array(52).join('a');
			phone = new Array(15).join('1')

			res = await exec()

			expect(res.status).toBe(400);
		});
		it('should return 400 if customer name or phone is not provided ',async ()=>{
			name = ''
			phone = ''
			res = await exec();

			expect(res.status).toBe(400);
		});
		it('should return 200 if customer is provided and saved',async ()=>{
			name = 'Rashid',
			phone= '123456'
			res = await exec();

			const customer = await Customer.find({name:'Rashid',phone:'123456'})

			expect(res.status).toBe(200);
			expect(customer).not.toBeNull()
		});
	})
	
	
	describe('PATCH /',()=>{
		let token;
		let newName;
		let newPhone;
		let customer;
		let id
		// utility function
		const exec = async ()=>{
			return await req(server)
			.patch('/api/customers/' + id)
			.send({name:newName,phone:newPhone});
		}
		beforeEach(async ()=>{
			customer = new Customer({name:'Rashid',phone:'123456'})
			await customer.save()
			id = customer._id;
			newName = 'updatedName'
			newPhone = 'updatedPhone'
		})
		it('it should return 200 if data is valid and data returned to the response',async()=>{
			newName = 'Dickson'
			newPhone= '123456'
			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('customer.name','Dickson')
			expect(res.body).toHaveProperty('customer.phone')
		});
		it('it should return 400 if the name && phone are less than 5 characters',async()=>{
			newName = '123';
			newPhone= '123'
			const res = await exec()
			expect(res.status).toBe(400)
		});
		it('it should return 400 if the name>50 && phone>15 characters',async()=>{
			newName = new Array(52).join('a')
			newPhone= new Array(16).join(1)
			const res = await exec()
			expect(res.status).toBe(400)
		});
		it('it should return 404 if id is invalid',async()=>{
			id = 1

			const res = await exec()

			expect(res.status).toBe(404)
		});
		it('it should return 404 if genre of that id is not found',async()=>{
			id = mongoose.Types.ObjectId();

			const res = await exec()

			expect(res.status).toBe(404)
		});
		it('it should return 200 if genre is saved',async()=>{
			newName = 'Rashid'
			newPhone = '123456'
			const res = await exec()
			expect(res.status).toBe(200)
		});
	})
	
	describe('DELETE /',()=>{
		let token;
		let customer;
		let id
		// utility function
		const exec = async ()=>{
			return await req(server)
			.delete('/api/customers/' + id)
			.set('x-access-token',token)
			.send();
		}
		beforeEach(async ()=>{
			customer = new Customer({name:'Rashid',phone:'1234567'})
			await customer.save()
			id = customer._id

			let user = new User()
			token = new User(user).generateAuthToken();
		})
		it('it should return 401 if token is not provided',async()=>{
			token = '';
			const res = await exec()
			expect(res.status).toBe(401)
		});
		it('it should return 400 if token is not invalid',async()=>{
			token = 'aff';
			const res = await exec()
			expect(res.status).toBe(400)
		});
		it('it should return 404 if id is invalid',async()=>{
			id = 1
			const res = await exec()
			expect(res.status).toBe(404)
		});
		it('it should return 404 if customer of that id is not found',async()=>{
			id = mongoose.Types.ObjectId();
			const res = await exec()
			expect(res.status).toBe(404)
		});
		it('it should return 200 if customer is deleted',async()=>{
			const res = await exec()

			expect(res.status).toBe(200)
		});
	})
	
});