const {User, Favourite, Review, Watchlist} = require('../models')
const chai = require('chai');
const spies = require('chai-spies');
const {expect} = require('chai');
const { User_Favourite } = require('../models/favourite');
chai.use(spies);

describe('User model', function () {
  beforeEach(() => {
    return User.sync({ force: true }); 
  })
  describe('Validators', function () {
    describe("Email", function(){
      it('Should throw an error if no email is defined', function () {
        return User.create({
          username: "username",
          password: "password",
          firstName: "firstName",
          lastName: "lastName"
        }).catch((error)=>{
          expect(error.message).to.be.equal('notNull Violation: user.email cannot be null');
        })
      });
      it('Should throw an error if the inputed email does not have an email format', function () {
        return User.create({
          email: "email",
          username: "username",
          password: "password",
          firstName: "firstName",
          lastName: "lastName"
          })
          .catch((error)=>{
          expect(error.message).to.be.equal('Validation error: Validation isEmail on email failed');
          })
        });
        it('Should throw an error if the email already exists', function () {
          return User.bulkCreate([
            {
              email: "email@email.com",
              username: "username",
              password: "Password1",
              firstName: "firstName",
              lastName: "lastName"
            },{
              email: "email@email.com",
              username: "username2",
              password: "Password2",
              firstName: "firstName",
              lastName: "lastName"
              }
            ])
            .catch((error)=>{
              expect(error.errors[0].message).to.be.equal('email must be unique');
            })
          });
      });
    describe("Username", function(){
      it('Should throw an error if no username is provided', function () {
        return User.create({
          email: "email@email.com",
          password: "Password1",
          firstName: "firstName",
          lastName: "lastName"
        }).catch((error)=>{
          expect(error.message).to.be.equal('notNull Violation: user.username cannot be null');
        });
      });
      it('Should throw an error if the username has more than 20 characters', function () {
        return User.create({
          email: "email@email.com",
          username: "longUsernameToTestValidation",
          password: "Password1",
          firstName: "firstName",
          lastName: "lastName"
        }).catch((error)=>{
          expect(error.message).to.be.equal("The username must have less than 8 characters");
        });
      });
      it('Should throw an error if the username already exists', function () {
        return User.bulkCreate([
          {
            email: "email@email1.com",
            username: "username",
            password: "Password1",
            firstName: "firstName",
            lastName: "lastName"
          },{
            email: "email@email2.com",
            username: "username",
            password: "Password2",
            firstName: "firstName",
            lastName: "lastName"
            }
          ])
          .catch((error)=>{
            expect(error.errors[0].message).to.be.equal('username must be unique');
          });
        });
    });
    describe("Password", function(){
      it('Should throw an error if no password is provided', function () {
        return User.create({
          email: "email@email.com",
          username: "username",
          firstName: "firstName",
          lastName: "lastName"
        }).catch((error)=>{
          expect(error.message).to.be.equal('notNull Violation: user.password cannot be null');
        });
      });
      it('Should throw an error if the given password is shorter than 8 characters', function () {
        return User.create({
          email: "email@email.com",
          username: "username",
          password: "Pass1",
          firstName: "firstName",
          lastName: "lastName"
        }).catch((error)=>{
          console.log(error)
          expect(error.message).to.be.equal("The password must be a least 8 characters long");
        });
      });
      it('Should throw an error if the given password is does not contain an upper-case letter, a lower-case letter and a number', function () {
        return User.create({
          email: "email@email.com",
          username: "username",
          password: "password",
          firstName: "firstName",
          lastName: "lastName"
        }).catch((error)=>{
          expect(error.message).to.be.equal("The password must contain at least an upper case letter, a lower case letter and a number");
        });
      }); 
    });
    describe("First Name", function(){
      it('Should throw an error if no first name is provided', function () {
        return User.create({
          email: "email@email.com",
          username: "username",
          password: "Password1",
          lastName: "lastName"
        }).catch((error)=>{
          expect(error.message).to.be.equal('notNull Violation: user.firstName cannot be null');
        });
      });
      it('Should throw an error if the given First Name contains a number or symbol', function () {
        return User.create({
          email: "email@email.com",
          username: "username",
          password: "Password1",
          firstName: "X AE A-12",
          lastName: "lastName"
        }).catch((error)=>{
          expect(error.errors[0].message).to.be.equal(   "The First Name should only contain letters");
        });
      });
    });
    describe("Last Name", function(){
      it('Should throw an error if no first name is provided', function () {
        return User.create({
          email: "email@email.com",
          username: "username",
          password: "Password1",
          firstName: "firstName"
        }).catch((error)=>{
          expect(error.message).to.be.equal('notNull Violation: user.lastName cannot be null');
        })
      });
      it('Should throw an error if the given Last Name contains a number or symbol', function () {
        return User.create({
          email: "email@email.com",
          username: "username",
          password: "Password1",
          firstName: "firstName",
          lastName: "X AE A-12"
        }).catch((error)=>{
          expect(error.errors[0].message).to.be.equal("The Last Name should only contain letters");
        });
      });
    });
    describe("Associations",function(){
      describe("User to User association", function(){
        it("User has a setFollowing() method to follow another user", async function(){
          let user1 = await User.create({
            email: "email1@email.com",
            username: "username1",
            password: "Password1",
            firstName: "One",
            lastName: "OneLast"
          })
          let user2 = await User.create({
            email: "email2@email.com",
            username: "username2",
            password: "Password2",
            firstName: "Two",
            lastName: "TwoLast"
          })
          await user1.setFollowing(user2)
          
          let userQuery1 = await User.findOne({
              where: {id: user1.id},
              include: {
                  model: User,
                  through: "Following",
                  as: "following"
              }})
  
          expect(userQuery1.following).to.exist
          expect(userQuery1.following).to.be.an("Array")
          expect(userQuery1.following[0]).to.be.instanceOf(User)
          expect(userQuery1.following[0].username).to.equal("username2")
          
          let userQuery2 = await User.findOne({
            where: {id: user2.id},
            include: {
                model: User,
                through: "Following",
                as: "follower"
            }})
          
          expect(userQuery2.follower).to.exist
          expect(userQuery2.follower).to.be.an("Array")
          expect(userQuery2.follower[0]).to.be.instanceOf(User)
          expect(userQuery2.follower[0].username).to.equal("username1")
        });
        it("User has a setFollower() method to be followed by another user", async function(){
          let user3 = await User.create({
            email: "email3@email.com",
            username: "username3",
            password: "Password3",
            firstName: "Three",
            lastName: "ThreeLast"
          })
          let user4 = await User.create({
            email: "email4@email.com",
            username: "username4",
            password: "Password4",
            firstName: "Four",
            lastName: "FourLast"
          })
          await user3.setFollower(user4)
          
          let userQuery3 = await User.findOne({
              where: {id: user3.id},
              include: {
                  model: User,
                  through: "Following",
                  as: "follower"
              }})
  
          expect(userQuery3.follower).to.exist
          expect(userQuery3.follower).to.be.an("Array")
          expect(userQuery3.follower[0]).to.be.instanceOf(User)
          expect(userQuery3.follower[0].username).to.equal("username4")
          
          let userQuery4 = await User.findOne({
            where: {id: user4.id},
            include: {
                model: User,
                through: "Following",
                as: "following"
            }})
          
          expect(userQuery4.following).to.exist
          expect(userQuery4.following).to.be.an("Array")
          expect(userQuery4.following[0]).to.be.instanceOf(User)
          expect(userQuery4.following[0].username).to.equal("username3")
        });
      });
      describe("Watchlist belongs to User", function(){
        it("Watchlist has a method setUser()", async function(){
          let watchlist = await Watchlist.create({title: "classics"})
          let user = await User.create({
            email: "email@email.com",
            username: "username",
            password: "Password1",
            firstName: "First",
            lastName: "Last"
          })
          await watchlist.setUser(user)
          let userQuery = await User.findOne({where: {id: user.id}, include: {model: Watchlist}})
          expect(userQuery.watchlists).to.exist
          expect(userQuery.watchlists).to.be.an("Array")
          expect(userQuery.watchlists[0]).to.be.instanceOf(Watchlist)
          expect(userQuery.watchlists[0].title).to.be.equal("classics")
        });
        it("Its possible to bring all the Watchlists with their User_Favourites", async function(){
          let watchlist = await Watchlist.findOne({where:{title: "classics"}})
          let user = await User.create({
            email: "email@email.com",
            username: "username",
            password: "Password1",
            firstName: "First",
            lastName: "Last"
          })
          let favourite = await Favourite.create({
            movieId: "test1"
          })
          await watchlist.setUser(user)
          await user.addFavourite(favourite)
          let userFav = await User_Favourite.findOne({where: {userId: user.id, favouriteId: favourite.id}})
          await userFav.setWatchlist(watchlist)
          let result = await user.getWatchlistsAndMovies()
          expect(result[0].watchlist).to.be.instanceOf(Watchlist)
          expect(result[0].watchlist.title).to.equal("classics")
          expect(result[0].movies).to.exist
          expect(result[0].movies).to.be.an("Array")
          expect(result[0].movies[0]).to.be.instanceOf(Favourite)
          expect(result[0].movies[0].movieId).to.equal("test1")
        });
      });
    });
  });
});
