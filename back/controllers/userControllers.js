const {User, Favourite, Review, User_Favourite, Watchlist} = require('../models')
const Sequelize = require("sequelize")
const passport = require("passport")

const object = {}

object.searchUsers = async (req,res,next) => {
    try{
        let username = req.query.s
        let users = await User.findAll({where: {
            username: {[Sequelize.Op.iLike]: `%${username}%`}}})
        res.status(200).send(users)
    }catch(e){
        next(e)
    }
}

object.getUser = async (req,res,next) => {
    try{
        let id = req.params.id
        let user = await User.findByPk(id)
        res.status(200).send(user)
    }catch(e){
        next(e)
    }
}

object.registerUser = async (req,res,next) =>{
    let user = await User.create(req.body)
    res.status(201).send(user)
}


object.isAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()) next()
    else res.sendStatus(401)
}

object.loggedUser = (req,res,next) => {
    res.send(req.user)
}

object.logOutUser = (req,res,next) => {
    req.logout();
    req.session.destroy()
    res.send("Logout");
}

object.followUser = async (req, res, next) => {
    try {
        let loggedUser = await User.findByPk(req.user.id)
        let followedUser = await User.findByPk(req.params.id)
        await loggedUser.setFollowing(followedUser)
        res.sendStatus(201)
    }
    catch(e){
        next(e)
    }
}

object.getFollowers = async (req, res, next) => {
    try{
        let loggedUser = await User.findByPk(req.user.id) 
        let followers = await loggedUser.getFollowers()
        res.status(200).send(followers)
    }catch(e){
        next(e)
    }
}

object.getFollowed = async (req, res, next) => {
    try{
        let loggedUser = await User.findByPk(req.user.id) 
        let followed = await loggedUser.getFollowing()
        res.status(200).send(followed)
    }catch(e){
        next(e)
    }
}

module.exports = object