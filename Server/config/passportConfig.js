// config/passportConfig.js

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/UsersModel.js";
import dotenv from "dotenv";
import { verifyEmailToken } from "../Services/userService.js";
import generateProfilePicture from "../utils/profilePicGenerator.js";

dotenv.config();

const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackDomain = process.env.origin_Link;

const base_url = "/api/login/google/callback";

const fullapiLink = callbackDomain + base_url;

const passportConfig = () => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: fullapiLink,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Log the profile data
          // console.log("Google profile:", profile);
          let user = await User.findOne({
            googleId: profile.id,
            email: profile.emails[0].value,
          });

          if (!user) {
            const username = profile.emails[0].value;
            const profilePictureBuffer = await generateProfilePicture(username);

            user = new User({
              googleId: profile.id,
              email: profile.emails[0].value,
              username: profile.displayName,
              profilePicture: {
                name: `${username}_profile.png`,
                data: profilePictureBuffer,
                contentType: "image/png",
              },
              Name: profile.displayName,
              accountStatus: "active",
              role: "user",
            });
            await user.save();
          }

          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id); // Ensure user._id exists
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
};

export default passportConfig;
