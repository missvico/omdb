const { User, Favourite, Review} = require('../models')
const db = require("../db")
const chai = require('chai');
const spies = require('chai-spies');
const {expect} = require('chai')

describe('Review model', function () {
    beforeEach(() => {
      return db.sync({ force: true }); 
    })
    describe('Validators', function () {
        describe("movieId", function(){
            it('Should throw an error if no movieId is defined', function(){
            return Review.create({
                rating: 4
            }).catch((error)=>{
                expect(error.message).to.be.equal('notNull Violation: review.movieId cannot be null');
                });
            });
            it('Should throw an error if the movieId is an empty string', function(){
                return Review.create({
                    rating: 4,
                    movieId: ""
                }).catch((error)=>{
                    expect(error.message).to.be.equal('Validation error: MovieId required');
                    });
                });
        });
        describe("rating", function(){
            it('Should throw an error if no rating is defined', function(){
            return Review.create({
                movieId: "test1"
            }).catch((error)=>{
                expect(error.message).to.be.equal('notNull Violation: review.rating cannot be null');
                })
            });
            it('Should throw an error if no rating is below 1', function(){
                return Review.create({
                    movieId: "test1",
                    rating: 0
                }).catch((error)=>{
                    expect(error.message).to.be.equal("Validation error: Rating must be between 1 and 5");
                    })
                });
            it('Should throw an error if no rating is below 1', function(){
                return Review.create({
                        movieId: "test1",
                        rating: 6
                }).catch((error)=>{
                    expect(error.message).to.be.equal("Validation error: Rating must be between 1 and 5");
                });
            });
        });
    });

    describe('Relations', function () {
        it("The review can be linked to a user", function(){
            const user = User.create({
                email: "email@email.com",
                username: "username",
                password: "Password1",
                firstName: "firstName",
                lastName: "lastName"
            });
            const review = Review.create({
                movieId: "idtest",
                content: "Really good!",
                rating: 4
            });
            return Promise.all([user, review])
            .then(([user, review])=>{
                return review.setUser(user)
            }).then(()=>{
                return Review.findOne({
                    where: {movieId: "idtest"},
                    include:{model: User}
            }).then((review)=>{
                expect(review.user).to.exist
                expect(review.user.email).to.equal("email@email.com")
            })
            }).catch(err=> console.log(err))
        });
    });

    describe("Class Methods", function(){
        beforeEach(()=>{
                return Review.bulkCreate([{
                    movieId: "testid",
                    rating: 2
                },{
                    movieId: "testid",
                    rating: 4
                }])
            })
        describe("Get Movies Reviews", function(){
            it("Is a class method that recieves an ImdbID and returns the reviews", function(){
                    return Review.getMovieReviews( "testid")
                    .then((reviews)=>{
                    expect(reviews).to.have.lengthOf(2)
                    expect(reviews[0].rating).to.equal(2)
                    expect(reviews[1].rating).to.equal(4)
                })
            })
        });
        describe("Rating average", function(){
            it("Is a class method that recieves an ImdbID and returns the rating average", function(){
                    return Review.getRatingAverage( "testid")
                    .then((average)=>{
                    expect(average).to.equal(3)
                })
            })
        })
    })
});

