import asyncWrapper from '../utils/asyncHandler.js';
import AppErrors from '../utils/AppErrors.js';
import bcrypt from 'bcryptjs';
import {generateToken} from '../utils/jwt.js';
import { StatusCodes } from '../utils/constants.js';
import { appResponses } from '../utils/AppResponses.js';
import * as userRepo from '../repo/Users/user.repo.js';

const isProd = process.env.NODE_ENV === 'production'

const setAuthCookie = (res,token)=>{
    return res.cookie("access_token",token,{
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    })
}

export const signIn = asyncWrapper(async (req,res,next)=>{
    const {email,password} = req.body;
    if(!email || !password){
        throw AppErrors.badRequest(res,'Email and Passwored are Required / البريد الالكترونى والرقم السرى مطلوبين')
    }
    const existUser = await userRepo.findByEmail(email);
    if(!existUser){
        throw AppErrors.notFound('Invalid Email Or Password / البريد الالكترونى او الرقم السرى خطأ')
    }

    const isMatch = bcrypt.compare(password,existUser.password);

    if(!isMatch){
        throw AppErrors.unauthorized(res,'Invalid Email Or Password / البريد الالكترونى او الرقم السرى خطأ')
    }

    const token = generateToken({
            id:existUser._id,
            role:existUser.role,
            name:existUser.name,
            email:existUser.email
        },
        { expiresIn: '1d' }
    );

    const {password:_,...safeUser} = existUser.toObject();

    return setAuthCookie(res,token)
            .status(StatusCodes.OK)
            .json({user:safeUser,token});
})

export const signUp =asyncWrapper(async (req,res,next)=>{

    const {name,email,password,confirmPassword,role} = req.body;

    if(!name||!email||!password||!confirmPassword||!role){

        throw AppErrors.badRequest("Missing required fields / هنالك حقل مطلوب")
    }
    
    const existUser = await userRepo.findByEmail(email.toLowerCase());
    
    if(existUser){
        throw AppErrors.conflict("A user with this email already exists / المستخدم صاحب هذا البريد مسجل بالفعل")
    }

    if(confirmPassword !== password){
        console.log("password",password,"confrirm Password",confirmPassword);
        

        throw AppErrors.badRequest('Password is not Math / الرقم السرى غير متطابق');
        
    }

    const newUser = await userRepo.create(req.body);

    return appResponses.success(res,newUser,'User Registerd Successfully / تم تسجيل المستخدم بنجاح',StatusCodes.CREATED)
})

export const adminSignUp = asyncWrapper(async (req,res,next)=>{
    const { email,password,role } = req.body;
        
        // Check for required fields
        if (!email || !password ||!role) {
            return AppErrors.badRequest(res, {
                message: "Missing required fields / احد الحقول مطلوب",
                details: {
                    email: !email ? "Email is required / البريد الالكترونى مطلوب" : null,
                    password: !password ? "Password is required / الرقم السرى مطلوب" : null,
                    role: !role ? "Role is Required / المسؤليه مطلوبه" : null
                }
            });
        }

        // Check if admin already exists
        const existingAdmin = await userRepo.findByEmail(email.toLowerCase() );
        
        if (existingAdmin) {
            return AppErrors.conflict(res, {
                message: "Registration failed / فشل التسجيل",
                error: "An admin with this email already exists / المسؤل صاحب هذا البريد مسجل بالفعل"
            });
        }

        // Create new admin
        const newAdmin = await userRepo.create(req.body);

        return appResponses.success(res, newAdmin, "Admin registered successfully / تم تسجيل المسؤل بنجاح", StatusCodes.CREATED);
})

export const signOut =asyncWrapper(async (req,res,next)=>{
    res.clearCookie("access_token", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
    });
    return appResponses.success(res, {}, "Successfully logged out / تسجيل الخروج تم بنجاح");
})

export const googleCallback = async (req, res, next) => {
  console.log("googleCallback triggered, req.user:", req.user);
  try {
    if (!req.user) {
      console.error("No user provided by Passport");
      return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
    }

    const user = req.user;
    const token = generateToken({ id: user._id, role: user.role }, { expiresIn: '1d' });
    const { password: _, ...safeUser } = user.toObject();

    console.log("Setting cookie and redirecting for user:", safeUser);
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .redirect(`${process.env.CLIENT_URL}`);
  } catch (err) {
    console.error("Google callback error:", err.message);
    res.redirect(
      `${process.env.CLIENT_URL}/auth/login?error=${encodeURIComponent(
        err.message
      )}`
    );
  }
};

export const facebookCallback = async (req,res,next)=>{
    console.log("facebookCallback triggered, req.user:", req.user);
    try {
        if (!req.user) {
            console.error("No user provided by Passport");
            return res.redirect(`${process.env.CLIENT_URL}/login?error=no_user`);
        }
        const user = req.user;
        const token = generateToken({ id: user._id, role: user.role }, { expiresIn: '1d' });
        const { password: _, ...safeUser } = user.toObject();

        console.log("Setting cookie and redirecting for user:", safeUser);
        res
        .cookie("access_token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        })
        .redirect(`${process.env.CLIENT_URL}`);
    } catch (error) {
        console.error("facebook callback error:", err.message);
        res.redirect(
        `${process.env.CLIENT_URL}/login?error=${encodeURIComponent(
            err.message
        )}`
        );
    }
}