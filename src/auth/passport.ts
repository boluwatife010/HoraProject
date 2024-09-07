import passport from 'passport';
import {Strategy as GoogleStrategy} from 'passport-google-oauth20';
import { userModel } from '../models/usermodel';
import dotenv from 'dotenv';
import { Iuser } from '../interfaces/user';
dotenv.config();
passport.use(
    new GoogleStrategy({
        clientID : process.env.CLIENT_ID || '',
        clientSecret: process.env.CLIENT_SECRET || '',
        callbackURL: 'http://localhost:8090/api/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const existingUser = await userModel.findOne({googleId: profile.id})
            if (existingUser) {
                return done(null, existingUser)
            }
            const newUser = new userModel({
                googleId: profile.id,
                name: profile.displayName,
                email:profile.emails?.[0].value,
                profilePicture:profile.photos?.[0].value
            })
            await newUser.save();
            done (null, newUser);
        }
        catch (error) {
            done(error, false);
          }
    }
    
)

)
passport.serializeUser((user, done) => {
    done(null, (user as Iuser).id);
})
passport.deserializeUser(async(id: string, done)=> {
    try {
        const user = await userModel.findById(id);
        if (!user) {
          return done(null, false); 
        }
        done(null, user);
      } catch (error) {
        done(error, null);
      }
})
export default passport