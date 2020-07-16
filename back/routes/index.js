const express = require("express")
const router = express.Router()
const favouritesRoutes = require("./favouritesRoutes")
const userRoutes = require("./userRoutes")
const reviewRoutes = require("./reviewRoutes")

router.use("/users", userRoutes)
router.use("/reviews", reviewRoutes)

module.exports = router