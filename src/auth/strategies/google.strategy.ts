import * as passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

const GOOGLE_CLIENT_ID = '105041112417-ot3fki9ph490erku4s54sn0obscgi0m4.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, cb) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    },
  ),
);
