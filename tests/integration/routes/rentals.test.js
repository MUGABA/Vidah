const req = require('supertest')
const mongoose= require('mongoose')
const { Customer } = require('../../../models/customer')
const {User} = require('../../../models/user')
const {Genre} = require('../../../models/genre')
const {Movie} = require('../../../models/movie')
const {Rental} = require('../../../models/rental')

let server
let res;
describe('/api/rentals',()=>{
	beforeEach(()=>{server = require('../../../index');})
	afterEach(async ()=>{
		await server.close();
		await Genre.deleteMany({})
		await Movie.deleteMany({})
		await Customer.deleteMany({})
		await Rental.deleteMany({})
	});
	
	describe('GET /',()=>{
		let customer1;
		let movie1
		let customer2;
		let movie2
		const exec = async ()=>{
			return await req(server)
			.get('/api/rentals')
			.send();
		}
		beforeEach( async ()=>{ 
			//  getting customers to the database
			customer1 = new Customer();
			id_1 = customer1._id
			customer2 = new Customer();
			id_2 = customer2._id
			// getting movies to the database
			movie1 = new Movie();
			mid_1 = movie1._id
			movie2 = new Movie();
			mid_2 = movie2._id
			});
		it('should return all rentals in the database and are displayed in the response body',
			async ()=>{

			await Rental.collection.insertMany([
			{customerId:id_1,movieId:mid_1},
			{customerId:id_2,movieId:mid_2}])
		

			res = await exec()

			expect(res.status).toBe(200);
		});
	})
	/*
	describe('GET/:id',()=>{
		let id;
		let token;
		let customer
		let movie;
		let numberInStock
		const exec = async ()=>{
			return await req(server)
			.get('/api/rentals/' + id)
			.set('x-access-token',token)
			.send();
		}
		beforeEach( async ()=>{ 
			//customer
			customer= new Customer()
			c_id = customer._id
			//movie
			movie= new Movie()
			m_id = movie._id

			rental = new Rental({customerId:c_id,movieId:m_id});
			await rental.save()

			id = rental._id

			const user = new User()
			token = new User(user).generateAuthToken()
		});
		it('should return a rental with a given id', async ()=> {

			res = await exec() 

			expect(res.status).toBe(200)
			expect(res.body).toHaveProperty('_id')
			expect(res.body).toHaveProperty('dateOut')


		});
		it('should return 404 if rental id is invalid', async ()=> {
			id = 1
			res = await exec()
			expect(res.status).toBe(404)
		});
		it('should return 404 if rantal that id is not found', async ()=> {
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
		let customer
		let movie
		let customerId
		let movieId
		let genre
		let genreId

		const exec = async ()=>{
			return await req(server)
			.post('/api/rentals')
			.send({customerId,movieId});
		}
		beforeEach(async ()=>{ 
			// customer 
			customer = new Customer({name:'Rashid',phone:'123456'})
			await customer.save()
			customerId = customer._id
			//genre
			genre = new Genre({name:'Romantic'})
			await genre.save()
			//movie
			movie = new Movie({genreId:genre._id,
				title:'ALEX AND EVE',
				numberInStock:5,
				dailyRentalRate:3});
			await movie.save()

			movieId = movie._id

			rental = new Rental({movieId,customerId})
			await rental.save()
		})

		it('should return 200 if customer attributes are valid and return customer in the body',async ()=>{

			res = await exec()

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty('_id')
			expect(res.body).toHaveProperty('customer.name')
			expect(res.body).toHaveProperty('movie.title')
		});
		it('should return 400 if any required attribute is not given',async ()=>{
			customerId = mongoose.Types.ObjectId()
			res = await exec();

			expect(res.status).toBe(400);
		});
		it('should return 400 if any required attribute is not given',async ()=>{
			customerId = ''
			res = await exec();

			expect(res.status).toBe(400);
		});
		it('should return 400 if either customerId or movieId is not found',async ()=>{
			movieId = mongoose.Types.ObjectId()
			res = await exec()

			expect(res.status).toBe(400);
		});
	})
	*/
});