const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport')
const User = require('../models/user-model')


var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
opts.secretOrKey = process.env.PRIVATKEY;

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            let foundUser = await User.findOne({ _id: jwt_payload })
            if (foundUser) {
                return done(null, foundUser)
            }
            else {
                return done(null, false);
            }
        }
        catch (err) {
            return done(err, false);
        }

    }));