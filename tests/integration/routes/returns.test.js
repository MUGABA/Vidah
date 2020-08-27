const req = require('supertest')
const mongoose= require('mongoose') 
const {Rental} = require('../../../models/rental')
const {Movie} = require('../../../models/movie')
const {Customer} = require('../../../models/customer')
const {User} = require('../../../models/user')

let server
let res;
describe('/api/rentalS',()=>{
	beforeEach(()=>{server = require('../../../index');})
	afterEach(async ()=>{
		await server.close();
		await Rental.deleteMany({})
		await Customer.deleteMany({})
		await Movie.deleteMany({})

	});


	describe('POST /',()=>{

		const exec = async ()=>{
			return await req(server)
			.post('/api/returns')
			.set('x-access-token',token)
			.send();
		}
		beforeEach( async ()=>{

			customer1 = new Customer();
			id_1 = customer1._id
			customer2 = new Customer();
			id_2 = customer2._id
			// getting movies to the database
			movie1 = new Movie();
			mid_1 = movie1._id
			movie2 = new Movie();
			mid_2 = movie2._id

			await Rental.collection.insertMany([
			{customerId:id_1,movieId:mid_1},
			{customerId:id_2,movieId:mid_2}])


			const user = new User()
			// user.isAdmin = true
			token = new User(user).generateAuthToken()
		})
		it('should return 401 if non user accesses it',async ()=>{

			res = await exec()

			expect(res.status).toBe(401);
		});
	})

});