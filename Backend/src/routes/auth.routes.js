import express from "express";

import {registerUser,loginUser,logoutUser,getUserProfile, googleCallback,} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import passport from "passport";
import { registerValidator,loginValidator,} from "../validators/auth.validator.js";

const router = express.Router();

router.post("/register", registerValidator, validate, registerUser);
router.post("/login", loginValidator, validate, loginUser);
router.post("/logout", logoutUser);
router.get("/profile", protect, getUserProfile);
router.get("/google", passport.authenticate("google", {scope:["profile", "email" ]}));
router.get("/google/callback", passport.authenticate("google", {
    session: false,
   failureRedirect: process.env.NODE_ENV === "production" ? "/login" : "http://localhost:5173/login"
    }), googleCallback);
export default router;
