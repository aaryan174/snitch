import User from "../models/user.model.js";
import { generateToken } from "../utils/token.util.js";

const cookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production",
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, isSeller} = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: isSeller ? "seller" : "buyer"
    });

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return next(error);
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token", cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

export const getUserProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user: req.user,
  });
};

export const googleCallback = async (req, res) => {
  const {id, emails, displayName, photos } = req.user;
  const email = emails[0].value;
  const photo = photos[0].value;

  try {
    let user = await User.findOne({email})

    if(!user){
      user = await User.create({
        email,
        googleId: id,
        name: displayName
      })
    }

    const token = generateToken(user._id);

    res.cookie("token", token, cookieOptions);

    res.redirect("http://localhost:5173/");

  } catch (error) {
    console.log(error.message)
  }


 

}
