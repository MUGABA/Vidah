const req = require('supertest')
const mongoose= require('mongoose') 
const {Genre} = require('../../../models/genre')
const {User} = require('../../../models/user')
const {Movie} = require('../../../models/movie')

let server
let res;
describe('/api/movies',()=>{
	beforeEach(()=>{server = require('../../../index');})
	afterEach(async ()=>{
		await server.close();
		await Movie.deleteMany({})
		await Genre.deleteMany({})
	});
	
	describe('GET /',()=>{
		let genre;
		let id
		const exec = async ()=>{
			return await req(server)
			.get('/api/movies')
			.send();
		}
		beforeEach( async ()=>{ 
			genre = new Genre();
			id = genre._id
			await Movie.collection.insertMany([
			{title:'WHY HIM',
			genreId:id,
			numberInStock:3,
			dailyRentalRate:2},

			{title:'ALEX AND EVE',
			genreId:id,
			numberInStock:2,
			dailyRentalRate:1}
			])
		});
		it('should return all movies in the database and are displayed in the response body',
			async ()=>{

			res = await exec()

			expect(res.status).toBe(200);
			expect(res.body.length).toBe(2)
			expect(res.body.some(m => m.name === 'WHY HIM'))
			expect(res.body.some(m => m.name === 'ALEX AND EVE'))
		});
	})
	
	describe('GET/:id',()=>{
		let id;
		let token;
		let movie;
		const exec = async ()=>{
			return await req(server)
			.get('/api/movies/' + id)
			.set('x-access-token',token)
			.send();
		}
		beforeEach( async ()=>{ 

			genre = new Genre()

			_id = genre._id
			movie = new Movie({title:'WHY HIM',
			genreId:_id,
			numberInStock:3,
			dailyRentalRate:2
		});
			await movie.save()
			id = movie._id

			const user = new User()
			token = new User(user).generateAuthToken()
		});
		it('should return a movie with a given id', async ()=> {
			res = await exec() 

			expect(res.status).toBe(200)
			expect(res.body).toHaveProperty('title','WHY HIM')
			expect(res.body).toHaveProperty('numberInStock')
			expect(res.body).toHaveProperty('dailyRentalRate')


		});
		it('should return 404 if movie id is invalid', async ()=> {
			id = 1
			res = await exec()
			expect(res.status).toBe(404)
		});
		it('should return 404 if movie that id is not found', async ()=> {
			id = mongoose.Types.ObjectId()
			res = await exec()
			expect(res.status).toBe(404)
		});
		it('should return 401 if token is not found', async ()=> {
			token = ''
			res = await exec()
			expect(res.status).toBe(401)
		});
		it('should return 400 if token is invalid', async ()=> {
			token = 'a'
			res = await exec()
			expect(res.status).toBe(400)
		});
	});

	describe('POST /',()=>{
		let genre
		let token
		let title;
		let genreId;
		let numberInStock;
		let dailyRentalRate;
		const exec = async ()=>{
			return await req(server)
			.post('/api/movies')
			.set('x-access-token',token)
			.send({title,genreId,numberInStock,dailyRentalRate});
		}
		beforeEach(async ()=>{ 
			genre = new Genre({name:'genre1'})
			await genre.save()
			genreId = genre._id
			title= 'ALEX AND EVE'
			numberInStock = 5
			dailyRentalRate = 3
			let movie = new Movie({title,genreId,numberInStock,dailyRentalRate});

			token = new User().generateAuthToken()
		})

		it('should return 200 if customer attributes are valid and return customer in the body',async ()=>{

			res = await exec()

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('title')
			expect(res.body).toHaveProperty('genre.name')
		});
		it('should return 400 if any attribute has less than required characters',async ()=>{
			title='ALEX'
			res = await exec();

			expect(res.status).toBe(400);
		});
		it('should return 400 if has more than required length',async ()=>{
			title = new Array(52).join('a');

			res = await exec()

			expect(res.status).toBe(400);
		});
		it('should return 400 if any attribute required attribute is not provided',async ()=>{
			title = ''

			res = await exec();

			expect(res.status).toBe(400);
		});
		it('should return 400 if genre id is invalid',async ()=>{
			genreId = 1

			res = await exec();

			expect(res.status).toBe(400);
		});
		it('should return 400 if genre id is invalid',async ()=>{
			genreId = mongoose.Types.ObjectId()

			res = await exec();

			expect(res.status).toBe(400);
		});
	})
	
	
	describe('PUT /',()=>{
		let token;
		let newTitle;
		let newNummberInStock;
		let newDailyRentalRate;
		let genreId
		let id
		// utility function
		const exec = async ()=>{
			return await req(server)
			.put('/api/movies/' + id)
			.set('x-access-token',token)
			.send({title:newTitle,
				dailyRentalRate:newDailyRentalRate,
				genreId:genreId,
				numberInStock:newNummberInStock
			});
		}
		beforeEach(async ()=>{
			const genre = new Genre({name:'genre1'})
			await genre.save()

			genreId = genre._id
			const movie = new Movie({
				title:'ALEX AND EVE',
				numberInStock:6,
				dailyRentalRate:6,
				genreId:genreId
			})
			await movie.save()
			id = movie._id;
			newTitle = 'updatedTitle'
			newNummberInStock = 'updatedNumberInStock'
			newDailyRentalRate = 'updatedDailyRentalRate'
			genreId = genreId

			token = new User().generateAuthToken()
		})
		it('it should return 200 if data is valid and data returned to the response body',async()=>{

			newTitle = 'alex and eve'
			newNummberInStock = 8
			newDailyRentalRate = 5

			const res = await exec();
			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('title')
			expect(res.body).toHaveProperty('numberInStock')
			expect(res.body).toHaveProperty('dailyRentalRate')
		});
		// it('it should return 400 if any attribute has less characters needed',async()=>{

		// 	newTitle = 'alex'
		// 	newNummberInStock = 8
		// 	newDailyRentalRate = 5

		// 	const res = await exec()
		// 	expect(res.status).toBe(400)
		// });
		// it('it should return 400 if any attribute has more than expected characters',async()=>{
		// 	newTitle = new Array(52).join('a')
		// 	newNummberInStock = 8
		// 	newDailyRentalRate = 5

		// 	const res = await exec()
		// 	expect(res.status).toBe(400)
		// });
		// it('it should return 404 if id is invalid',async()=>{
		// 	id = 1
		// 	newTitle = 'alex and eve'
		// 	newNummberInStock = 8
		// 	newDailyRentalRate = 5

		// 	const res = await exec()

		// 	expect(res.status).toBe(404)
		// });
		// it('it should return 404 if movie of that id is not found',async()=>{
		// 	id = mongoose.Types.ObjectId();
		// 	newTitle = 'alex and eve'
		// 	newNummberInStock = 8
		// 	newDailyRentalRate = 5

		// 	const res = await exec()

		// 	expect(res.status).toBe(404)
		// });
	})
	
	// describe('DELETE /',()=>{
	// 	let token;
	// 	let customer;
	// 	let id
	// 	// utility function
	// 	const exec = async ()=>{
	// 		return await req(server)
	// 		.delete('/api/movies/' + id)
	// 		.set('x-access-token',token)
	// 		.send();
	// 	}
	// 	beforeEach(async ()=>{
	// 		const genre = new Genre({name:'genre1'})
	// 		await genre.save()

	// 		genreId = genre._id
	// 		const movie = new Movie({
	// 			title:'ALEX AND EVE',
	// 			numberInStock:6,
	// 			dailyRentalRate:6,
	// 			genreId:genreId
	// 		})
	// 		await movie.save()
	// 		id = movie._id;

	// 		let user = new User()
	// 		user.isAdmin = true
	// 		token = new User(user).generateAuthToken()
	// 	})
	// 	it('it should return 401 if token is not provided',async()=>{
	// 		token = '';
	// 		const res = await exec()
	// 		expect(res.status).toBe(401)
	// 	});
	// 	it('it should return 400 if token is not invalid',async()=>{
	// 		token = 'aff';
	// 		const res = await exec()
	// 		expect(res.status).toBe(400)
	// 	});
	// 	it('it should return 404 if id is invalid',async()=>{
	// 		id = 1
	// 		const res = await exec()
	// 		expect(res.status).toBe(404)
	// 	});
	// 	it('it should return 404 if movie of that id is not found',async()=>{
	// 		id = mongoose.Types.ObjectId();
	// 		const res = await exec()
	// 		expect(res.status).toBe(404)
	// 	});
	// 	it('it should return 200 if movie is deleted',async()=>{
	// 		const res = await exec()

	// 		expect(res.status).toBe(200)
	// 	});
	// 	it('it should return 403 if user is not admin deleted',async()=>{
	// 		user = new User()
	// 		user.isAdmin = false
	// 		token = new User(user).generateAuthToken()

	// 		const res = await exec()

	// 		expect(res.status).toBe(403)
	// 	});
	// })

	
});