// Get the configuration values
require('dotenv').config();

const connection = require('./database');
const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User');

/*
 * After a successful authentication, store the user in the session
 * as req.session.passport.user so that it persists across accesses.
 * See: https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize
 * Here, since no database is used, the full user profile has to be stored in the session.
 */
passport.serializeUser((user, done) => {
    
    done(null, user.id)
    console.log(user.id)
});

/*
* On each new access, retrieve the user profile from the session and provide it as req.user
* so that routes detect if there is a valid user context. 
*/
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
        
});

/*  Google AUTH  */

passport.use(
    new GoogleStrategy(
        // Strategy Parameters
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: process.env.REDIRECT_URL
            // Tell passport to trust the HTTPS proxy
            // callbackURL: process.env.REDIRECT_URL,
            // proxy: true
        },
        // Verify callback
        async (accessToken, refreshToken, params, profile, done) => {
            // console.log('Access Token:', accessToken);
            // console.log('Refresh Token:', refreshToken);
            // console.log('User profile:', profile._json);
            console.log('OAuth2 params:', params);
            try {
                let thisUser = await User.findOne({googleId: profile.id});
                if(thisUser){
                    console.log(' Found existing user:' , thisUser);
                    thisUser.accessToken = accessToken;
                    thisUser.expiryDate = expiryDate(params.expires_in);
                    await thisUser.save();
                    done(null, thisUser);
                }else {
                    thisUser = await new User({
                        googleId: profile.id,
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        accessToken: accessToken,
                        creationDate: new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'long'}).format(new Date()),
                        expiryDate: expiryDate(params.expires_in),
                        photo: profile.photos[0].value
                    }).save();
                    console.log('New user:', thisUser)
                    done(null, thisUser);
                }
            }catch(err){
                console.error(err);
                process.exit(1)
            }
        }
));

function expiryDate(interval){
    const date = new Date();
    date.setSeconds(date.getSeconds()+ interval);
    var newDate = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeStyle: 'long'}).format(new Date());
    return newDate;
}
