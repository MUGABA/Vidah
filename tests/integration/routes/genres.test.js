const req = require('supertest')
const mongoose= require('mongoose') 
const {Genre} = require('../../../models/genre')
const {User} = require('../../../models/user')

let server
let res;
describe('/api/genres',()=>{
	beforeEach(()=>{server = require('../../../index');})
	afterEach(async ()=>{
		server.close();
		await Genre.deleteMany({})
	});

	describe('GET /',()=>{
		it('should return all genres in the database',async ()=>{
			await Genre.collection.insertMany([
				{name:'genre1'},
				{name:'genre2'}
			])
			const res = await req(server).get('/api/genres');
			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2)
			expect(res.body.some(genre => genre.name === 'genre1')).toBeTruthy()
			expect(res.body.some(genre => genre.name === 'genre2')).toBeTruthy()
		});
		
	})
	/*
	describe('GET/:id',()=>{
		it('should return a genre with a given id', async ()=> {
			let genre = new Genre({name:'genre1'});
			await genre.save();
			res = await req(server).get('/api/genres/' + genre._id);
			expect(res.status).toBe(200)
			expect(res.body).toHaveProperty('name','genre1')
		});
		it('should return 404 if genre id is invalid', async ()=> {
			res = await req(server).get('/api/genres/1');
			expect(res.status).toBe(404)
		});
		it('should return 404 if genre if that id is not found', async ()=> {
			const id = mongoose.Types.ObjectId()
			res = await req(server).get('/api/genres/'+ id);
			expect(res.status).toBe(404)
		});
	});
	describe('POST /',()=>{
		//Moshy methods
		let token;
		let name;
		// utility function
		const exec = async ()=>{
			return await req(server)
			.post('/api/genres')
			.set('x-access-token',token)
			.send({name});
		}
		beforeEach(()=>{ 
			const user = new User()
			user.isAdmin = true
			token = new User(user).generateAuthToken()
			name = 'genre1'
		})

		it('should return 401 if not authorised',async ()=>{
			token = ''

			res = await exec()

			expect(res.status).toBe(401);
		});
		it('should return 400 if genre has lessthan 5 characters',async ()=>{
			name='1234'

			res = await exec();
			// change something
			expect(res.status).toBe(400);
		});
		it('should return 400 if genre has more than 50 characters',async ()=>{
			name = new Array(52).join('a');

			res = await exec()

			expect(res.status).toBe(400);
		});
		it('should return 400 if genre name is not provided ',async ()=>{
			name = ''
			res = await exec();

			expect(res.status).toBe(400);
		});
		it('should return 200 if genre name is provided and saved',async ()=>{
			res = await exec();

			const genre = await Genre.find({name:'genre1'})

			expect(res.status).toBe(200);
			expect(genre).not.toBeNull()
		});
		it('should return 200 if genre is returned to user in the body',async ()=>{

			res = await exec();

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('_id')
			expect(res.body).toHaveProperty('name','genre1')

		});
	})
	describe('PUT /',()=>{
		let token;
		let newName;
		let genre;
		let id
		// utility function
		const exec = async ()=>{
			return await req(server)
			.put('/api/genres/' + id)
			.set('x-access-token',token)
			.send({name:newName});
		}
		beforeEach(async ()=>{
			genre = new Genre({name:'genre1'})
			await genre.save()
			token = new User().generateAuthToken();
			id = genre._id;
			newName = 'updatedName'
		})
		it('it should return 401 if token is not provided',async()=>{
			token = '';
			const res = await exec()
			expect(res.status).toBe(401)
		});
		it('it should return 400 if the name has less than 5 characters',async()=>{
			newName = '123';
			const res = await exec()
			expect(res.status).toBe(400)
		});
		it('it should return 400 if the name has more than 50 characters',async()=>{
			newName = new Array(52).join('a')
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
			newName = 'genre1'
			const res = await exec()
			expect(res.status).toBe(200)
		});
		it('it should return 200 and  genre name in response body',async()=>{
			newName='genre1'

			const res = await exec()
			expect(res.status).toBe(200)
			expect(res.body).toHaveProperty('message','you updated a genre');
			expect(res.body).toHaveProperty('genre.name','genre1')
		});
	})
	describe('DELETE /',()=>{
		let token;
		let genre;
		let id
		// utility function
		const exec = async ()=>{
			return await req(server)
			.delete('/api/genres/' + id)
			.set('x-access-token',token)
			.send();
		}
		beforeEach(async ()=>{
			genre = new Genre({name:'genre1'})
			await genre.save()
			id = genre._id

			let user = new User()
			user.isAdmin=true
			token = new User(user).generateAuthToken();
		})
		it('it should return 401 if token is not provided',async()=>{
			token = '';
			const res = await exec()
			expect(res.status).toBe(401)
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
		it('it should return 200 if genre is deleted',async()=>{
			const res = await exec()
			
			expect(res.status).toBe(200)
		});
		it('it should return 200 and  genre name in response body',async()=>{
			const res = await exec()

			expect(res.status).toBe(200)

			expect(res.body).toHaveProperty('message','you deleted a genre');
			expect(res.body).toHaveProperty('genre.name','genre1')
		});
	})*/
});