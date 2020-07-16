const {User, Favourite, Review, User_Favourite, Watchlist} = require('../models')
const Sequelize = require("sequelize")

const controllers = new Object()

controllers.postRewiew = async function(req, res, next){
    try{
        const review = await Review.create(
            {
                ...req.body,
                movieId: req.params.id
            }
        )
        const user = await User.findByPk(req.user.id)   
        await review.setUser(user)
        res.status(201).send(review)
    } 
    catch(e){
        next(e)
    }
}

controllers.getMovieReviews = async function(req, res, next){
    try{
        const reviews = await Review.findAll({where: {movieId: req.params.id}})
        const ratingAverage = await Review.getRatingAverage(req.params.id)
        res.status(200).send({reviews, ratingAverage})
    }
    catch(e){
        next(e)
    }
}

controllers.getUserReviews = async function(req,res,next){
    try{
        const reviews = await Review.findAll({where: {userId: req.user.id}})
        res.status(200).send(reviews)
    }
    catch(e){
        next(e)
    }
}

module.exports = controllers