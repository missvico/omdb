const { User, Favourite, Review, User_Favourite, Watchlist} = require('../models')
const db = require("../db")
const chai = require('chai');
const spies = require('chai-spies');
const {expect} = require('chai');


describe('Favourite model', function () {
    before(() => {
      return db.sync({ force: true }); 
    })
    describe('Validators', function () {
        describe("movieId", function(){
            it('Should throw an error if no movieId is defined', function(){
            return Favourite.create({}).catch((error)=>{
                expect(error.message).to.be.equal('notNull Violation: favourite.movieId cannot be null');
                });
            });
            it('Should throw an error if the movieId is an empty string', function(){
                return Favourite.create({
                    movieId: ""
                }).catch((error)=>{
                    expect(error.message).to.be.equal('Validation error: MovieId required');
                    });
                });
        });
    });
    describe("Associations", function(){
        it("It is associated to a User through the table User_Favourite", async function(){
            let user = await User.create({
                email: "email@email.com",
                username: "username",
                password: "Password1",
                firstName: "firstName",
                lastName: "lastName"
            });
            let favourite = await Favourite.create({
                movieId: "test"
            })
            await user.addFavourite(favourite)
            let userQuery = await User.findOne({
                where: {id: user.id},
                include: {
                    model: Favourite
                }
            })
            let favouriteQuery = await Favourite.findOne({
                where: {id: user.id},
                include: {
                    model: User
                }
            })

            expect(userQuery.favourites).to.exist
            expect(userQuery.favourites).to.be.an('array')
            expect(userQuery.favourites[0].movieId).to.equal('test')

            expect(favouriteQuery.users).to.exist
            expect(favouriteQuery.users).to.be.an('array')
            expect(favouriteQuery.users[0].email).to.equal('email@email.com')
        })
        it("User_Favourite is associated to a watchlist", async function(){
            let [userFavourite] = await User_Favourite.findAll()
            await userFavourite.createWatchlist({title:"drama"})
            let watchlist = await Watchlist.findOne({title: "drama"})
            let userFavouriteTest = await User_Favourite.findOne({
                where: {id: userFavourite.id},
                include: {
                    model: Watchlist
                }})

            expect(userFavouriteTest.watchlist).to.exist
            expect(userFavouriteTest.watchlist.id).to.equal(watchlist.id)
            expect(userFavouriteTest.watchlist.title).to.equal("drama")
        });
    });
    describe("Instance methods", function(){
        it("getMovies must return the movies in a watchlist", async function(){
            let watchlist = await Watchlist.findOne({title: "drama"})
            let result = await watchlist.getMovies()
            expect(result).to.be.an('array')
            expect(result[0]).to.be.instanceOf(Favourite)
            expect(result[0].movieId).to.equal('test')
        })
    })
});