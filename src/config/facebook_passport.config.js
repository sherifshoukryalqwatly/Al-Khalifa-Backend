import passport from 'passport';
import { Strategy as FacebookStrategy } from "passport-facebook";
import dotenv from 'dotenv';
import User from '../models/Users/user.model.js'

const isProd = process.env.NODE_ENV === "production";

passport.use(
    new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: isProd ? process.env.FACEBOOK_CALLBACK_URL_PROD : process.env.FACEBOOK_CALLBACK_URL_DEV,
        passReqToCallback: true,
        profileFields: ['id', 'displayName', 'name', 'emails', 'photos']
    },
    async (_, __, ___, profile, done) => {
      console.log("FacebookStrategy profile:", profile);
      try {
        // Normalize email to avoid case-sensitivity issues
        const email = profile.emails[0].value.toLowerCase();

        // Check for existing user by facebookid or email
        let user = await User.findOne({
          $or: [{ faceBookid: profile.id }, { email }],
        });

        if (user) {
          // If user exists but faceBookid is missing, link Facebook account
          if (!user.faceBookid) {
            console.log("Linking Facebook account to existing email:", email);
            user.faceBookid = profile.id;
            user.name =  profile.displayName + " " + profile.provider || user.name;
            await user.save();
          }
          console.log("Found user:", user);
          return done(null, user);
        }

        // Create new user
        console.log("Creating new user for Facebook ID:", profile.id);
        user = await User.create({
          faceBookid: profile.id,
          name: profile.displayName + " " + profile.provider,
          email
        });
        console.log("Created user:", user);
        done(null, user);
      } catch (error) {
        console.error("GoogleStrategy error:", error.message);
        done(error, null);
      }
    }
    )
)