import express from "express";
import cookieParser from "cookie-parser";
import passport from "passport";
import {Strategy as GoogleStrategy } from "passport-google-oauth20"
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRouter from "./routes/product.routes.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import UserRouter from "./routes/User.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))



//oauth middleware
app.use(passport.initialize());

passport.use( new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "/api/auth/google/callback"
},
(accessToken, refreshToken, profile, done)=>{
  return done(null, profile);
}))




app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/products", productRouter);
app.use("/api/user", UserRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
