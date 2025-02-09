const passport = require("passport")
const bcrypt = require('bcrypt')
const User = require('../models/user.model')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config()

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}/auth/google/callback`
  },
  function(accessToken, refreshToken, profile, cb) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });

    User.findOne({ googleId: profile.id })
    .then(async (user) => {
      if (!user) {
        // If user does not exist, create a new one
        const newUser = new User({
          googleId: profile.id,
          username: profile.displayName,
        });
  
        await newUser.save(); // Save new user
        return cb(null, newUser);
      } else {
        // If user exists, return the user
        return cb(null, user);
      }
    })
    .catch((err) => cb(err, null));
  }
));

//create sessin id
//whenever we login it creates user id inside session
passport.serializeUser((user, done) => {
    done(null, user.id)
})

//find session info using session id
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        done(error, false)
    }
})