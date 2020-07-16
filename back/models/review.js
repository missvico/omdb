const S = require("sequelize")
const {Model} = require("sequelize")
const sequelize = require("../db")
const User = require("./user")

class Review extends Model {}
Review.init({
  movieId: {
    type: S.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        args: true,
        msg: "MovieId required"
      },
    }
  },
  content: {
    type: S.TEXT
  },
  rating: {
    type: S.INTEGER,
    allowNull: false,
    validate: {
      min: {
        args: [1],
        msg: "Rating must be between 1 and 5"
      },
      max: {
        args: [5],
        msg: "Rating must be between 1 and 5"
      }
    }
  }
}, {
  sequelize,
  modelName: 'review'
});

Review.belongsTo(User)

Review.getMovieReviews = function(movieId){
  return Review.findAll({
    where: {movieId},
    include: {model: User}
  })
}

Review.getRatingAverage = function(movieId){
  return Review.findAll({where: {movieId}})
  .then((reviews)=>{
    let ratings = reviews.map(review=> review.rating)
    return ratings.reduce(((a, b) => a + b),0)/ratings.length
  })
  .catch(e=>console.log(e))
} 

module.exports = Review