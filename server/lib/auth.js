require('dotenv').config()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/UserModel')

passport.use(new GoogleStrategy({
    clientID: process.env.googleClientID,
    clientSecret: process.env.googleClientSecret,
    callbackURL: "/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        const data = {
            name: profile.displayName,
            email: profile.emails[0].value
        }

        User.findOne({email:data.email}).then(existingUser => {
            if (existingUser) {
                console.log('Existing google user');
                return done(null, existingUser)
            }

            const user = new User(data)
            user.save().then((user) => {
                console.log('Saved new google user');
                return done(null, user)
            })
        })
    }
));

passport.serializeUser((user, done) => done(null, user._id))

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).exec()
        return done(null, user)
    } catch (error) {
        return done(error)
    }
})

module.exports = {
    initialize: passport.initialize(),
    session: passport.session()
}