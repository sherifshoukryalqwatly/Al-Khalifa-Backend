import { Strategy as JwtStratgy , ExtractJwt } from "passport-jwt";
import User from '../models/user.model.js';

export default (passport) =>{
    passport.use(
            new JwtStratgy({
                secretOrKey: process.env.JWT_SECRET,
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            },
            async (payload,done)=>{
                try {
                    const user = await User.findOne(payload.id);
                    if(!user)
                        return done(null,false);
                    return done(null,user);
                } catch (error) {
                    return done(error,false);
                }
            }
        )
    )
} 