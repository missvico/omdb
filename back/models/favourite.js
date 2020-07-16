const S = require("sequelize")
const {Model, Sequelize} = require("sequelize")
const sequelize = require("../db")
const User = require("./user")

class Favourite extends Model {}
Favourite.init({
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
}, {
  sequelize,
  modelName: 'favourite'
});

class User_Favourite extends Model {}
User_Favourite.init({
  id: {
    type: S.INTEGER,
    autoIncrement: true,
    primaryKey: true
  }
}, {
  sequelize,
  modelName: 'user_favourite'
});

class Watchlist extends Model {}
Watchlist.init({
  title: {
    type: S.STRING,
    defaultValue: "watchlist"
  }
}, {
  sequelize,
  modelName: 'watchlist'
});

//INSTANCE METHOD

Watchlist.prototype.getMovies = async function(){
  try{
    let result =await Watchlist.findOne({
      where: {id: this.id},
      include: {
        model: User_Favourite
      }
    })
    let favouritesIds = result.user_favourites.map(user_favourite => user_favourite.favouriteId)
    let favourites  = await Favourite.findAll({
      where: {id: {[Sequelize.Op.or]: favouritesIds}}
    })
    return favourites
  }
  catch(e){
    console.log(e)
  }
}


User.prototype.getWatchlistsAndMovies = async function(){
  try{
    let query = await User.findOne({
      where: {id: this.id},
      include: {
        model: Watchlist
      }
    })
    let list = query.watchlists
    const getData = async () => {
      return Promise.all(list.map(watchlist => watchlist.getMovies()))
    }
  
    return getData().then(data => {
      let result = []
      for(let i=0; i<data.length; i++){
        result.push({
          watchlist: list[i],
          movies: data[i]
        })
        return result
      } 
    })
  }
  catch(e){
    console.log(e)
  }
}

//ASSOCIATIONS
Favourite.belongsToMany(User, { through: User_Favourite });
User.belongsToMany(Favourite, { through: User_Favourite });

User_Favourite.belongsTo(Watchlist)
Watchlist.hasMany(User_Favourite)

Watchlist.belongsTo(User)
User.hasMany(Watchlist)

module.exports = {Favourite, User_Favourite, Watchlist}