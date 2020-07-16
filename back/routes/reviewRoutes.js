const express = require("express")
const router = express.Router()
const {reviewControllers, userControllers} = require("../controllers")
const passport = require("passport")

router.get("/:id", userControllers.isAuthenticated, reviewControllers.getMovieReviews)
router.post("/:id", userControllers.isAuthenticated, reviewControllers.postRewiew)

module.exports = router