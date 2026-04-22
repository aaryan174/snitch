import jwt from "jsonwebtoken";
import User from "../models/user.model.js";


export const sellerCheckMiddleware = async (req, res, next) => {
  try {
   
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null;

    const token = req.cookies.token || bearerToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token not provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    if(user.role !== "seller"){
        return res.status(403).json({
            message: "Unauthorized",
            success: false
        })
    }

    req.user = user;
    return next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
