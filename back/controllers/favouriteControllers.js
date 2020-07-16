const {User, Favourite, Review, User_Favourite, Watchlist} = require('../models')

const control = new Object()


control.getUserFavourites = async function(req,res,next){
    let favourites = Favourite.findAll({
        where: {
            userId: req.params.id
        }
    })
}