import express from "express";
import passport from "passport";
import { 
  googleCallback,
  signIn,
  signOut,
  signUp,
  facebookCallback,
  verifyOtp,
  resendOtp,
  requestResetPassword,
  resetPassword,
  me
  } from "../auth/auth.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import { createUserSchema } from "../validations/Users/user.validation.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// User routes
router.get("/me",isAuthenticated,me);
router.post("/login", signIn);
router.post("/register", validationMiddleware(createUserSchema), signUp);
router.post("/logout", signOut);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/request-reset-password", requestResetPassword);
router.post("/reset-password", resetPassword);


// Google OAuth routes
router.get(
  "/google/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/auth/login`,
  }),
  googleCallback
);

// passport Facebook
router.get(
  "/facebook/login",
  passport.authenticate("facebook", { scope: ["email", "public_profile"] })
);

router.get(
  "/facebook/callback",
  (req, res, next) => {
    console.log("Callback request received:", req.query);
    console.log("FACEBOOK CALLBACK (from env):", process.env.FACEBOOK_CALLBACK_URL_DEV);
    passport.authenticate("facebook", {
      session: false,
      failureMessage : "Failed To Login With Facebook",
      failureRedirect: `${process.env.CLIENT_URL}/login`,
      successRedirect : `${process.env.CLIENT_URL}/sucess`,
    })(req, res, next);
  },
  facebookCallback
);


export default router;
