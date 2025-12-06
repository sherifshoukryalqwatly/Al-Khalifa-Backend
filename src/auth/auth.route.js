import express from "express";
import passport from "passport";
import { googleCallback, signIn, signOut, signUp, adminSignUp } from "../auth/auth.controller.js";
import validationMiddleware, { createUserSchema } from "../validations/Users/user.validation.js";

const router = express.Router();

// User routes
router.post("/login", signIn);
router.post("/register", validationMiddleware(createUserSchema), signUp);
router.post("/logout", signOut);

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

export default router;
