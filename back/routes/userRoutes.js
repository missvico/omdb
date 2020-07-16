const express = require("express")
const router = express.Router()
const control = require("../controllers").userControllers
const passport = require("passport")

router.get("/", control.searchUsers)
router.post("/register", control.registerUser)
router.post("/login", passport.authenticate("local"), control.isAuthenticated, control.loggedUser)
router.post("/logout", control.isAuthenticated, control.logOutUser)
router.get("/me", control.isAuthenticated, control.loggedUser)
router.get("/:id", control.getUser)

module.exports = router
