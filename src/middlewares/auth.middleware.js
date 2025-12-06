import asyncWrapper from "../utils/asyncHandler";
import { appResponses } from "../utils/AppResponses";
import { decodeToken } from "../utils/jwt";
import Admin from "../models/Users/admin.model";
import User from "../models/Users/user.model";

export const isAuthenticated = asyncWrapper(async (req,res,next)=>{
    const authToken = req.cookies?.access_token || req.headers?.authorization;
    if(!authToken){
        return appResponses.unauthorized(res,'User must Logged In First / يجب تسجيل الدخول اولا')
    }
    const Barear = authToken.split(" ")[0];

    if(Barear){
        const token = authToken.split(" ")[1];
        if(!token){
            return appResponses.unauthorized(res,"User must Logged In First / يجب تسجيل الدخول اولا");
        }
    }else {
        const token = req.authToken;
        if(!token){
            return appResponses.unauthorized(res,"User must Logged In First / يجب تسجبل الدخول اولا");
        }
    }
    const decoded = decodeToken(token) ;
    if(!decoded){
        return appResponses.unauthorized(res,"User must Logged In First / يجب تسجيل الدخول اولا")
    }

    const admin = await Admin.findById(decoded.id).select("-password");

    const user = await User.findById(decoded.id).select("-password");

    if(!user || !admin){
        return appResponses.unauthorized(res,"User must Logged In First / يجب تسحيل الدحول اولا")
    }

    if(user){
        req.user = user
    }else {
        req.user = admin
    }

    next()
});

export const authorizeRole = (...role)=>{
    return (req,res,next)=>{
        if(!req.user || !role.includes(req.user.role)){
            return appResponses.forbidden(res,'Not Have Permissions / لا تمتلك الحقوق ')
        }
        next ()
    }

}