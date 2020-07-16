const express = require('express')
const app = express()
const port = 3000
const db = require('./db')
const volleyball = require("volleyball")
const path = require("path")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const passport = require("passport")
const session = require("express-session")
const LocalStrategy = require("passport-local").Strategy
const {User} = require("./models")
const routes = require("./routes")

//Logging middleware
app.use(volleyball)

// Parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cookieParser())

//Static middleware
app.use('/', express.static(path.join(__dirname, 'public')))

// express-session init
app.use(session({ secret: "bootcamp" })) // req.session // The secret is used to sign the session id cookie, to prevent the cookie to be tampered with.

/* ------------ PASSPORT -----------*/
// passport init and session connection
app.use(passport.initialize());
app.use(passport.session()); // Express stuffs the id of the session object into a cookie on the client's browser, which gets passed back to express in a header on every request. This is how Express identifies multiple requests as belonging to a single session even if the user is not logged in.

//auth strategy definition | localstrategy | http://www.passportjs.org/packages/passport-local/
passport.use(new LocalStrategy({
    usernameField: 'username', // input name for username
    passwordField: 'password' // input name for password
  },
  function(username, password, done) {
    User.findOne({ where: {username} }) // searching for the User
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user); // the user is authenticated ok!! pass user to the next middleware in req object (req.user)
      })
      .catch(done); // this is returning done(error)
  }
));

// serialize: how we save the user and stored in session object by express-session
passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  // deserialize: how we look for the user
  passport.deserializeUser(function(id, done) {
    User.findByPk(id)
      .then(user => done(null, user))
  });

//Routing
app.use("/api", routes)

//Para Front Routing
app.use("/*", function(req, res, next){
  res.sendFile(__dirname+"/public/index.html")
})

db.sync({force:false})
.then(()=>{
    console.log('Database ready')
    app.listen(port, () => {
        console.log(`Server on port ${port}`);
      });
})
.catch((err)=> console.log(err))