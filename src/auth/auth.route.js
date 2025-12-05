import express from "express";
import { adminSignUp, signIn, signOut, signUp } from "./auth.controller.js";
import validationMiddleware , {createUserSchema} from '../validations/Users/user.validation.js';

const router = express.Router();

//user routes
router.post("/login", signIn);
router.post("/register",validationMiddleware(createUserSchema), signUp);
router.post("/logout", signOut);

// Admin routes
// router.post("/adminlogin", adminSignIn);
// router.post("/adminRegister",validationMiddleware(createAdminSchema), adminSignUp);
// router.post("/adminlogout", signOut);

export default router;

