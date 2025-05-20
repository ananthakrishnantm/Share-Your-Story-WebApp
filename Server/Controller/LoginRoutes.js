import express from "express";
import { User } from "../models/UsersModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import passport from "passport";
import decodedToken from "../middleware/DecodingMiddleware.js";

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY;
const successRedirectLink = process.env.origin_Link;
const authRouter = express.Router();

// Normal login
authRouter.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Incorrect email" });
    }

    const savedPassword = await bcrypt.compare(password, user.password);

    if (!savedPassword) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email" });
    }

    if (user.isBanned) {
      return res
        .status(403)
        .json({ message: "Your account has been suspended." });
    }

    // User authenticated, generate JWT token
    const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);

    // Create cookie
    res.cookie("cookie", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      path: "/",
    });

    return res.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Google login
authRouter.get(
  "/google",
  passport.authenticate("google", {
    successMessage: "Login Successful",
    scope: ["profile", "email"],
  })
);

// Google callback
authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),

  async (req, res) => {
    try {
      // User authenticated, generate JWT token

      const user = req.user;
      //test this later
      if (!user.isBanned) {
        return res.status(403).json({ message: "User is banned" });
      }

      const token = jwt.sign({ userId: user._id, role: user.role }, secretKey);

      // Create cookie
      res.cookie("cookie", token, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        path: "/",
      });

      // Redirect to home page or profile page
      res.redirect(`${successRedirectLink}/home`);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

// Logout
authRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/"); // Redirect to home page after logout
});
//the reason it didnt work = didnt declare import  dotenv properly
authRouter.get("/status", decodedToken, async (req, res) => {
  const userId = req.userId;
  const role = req.role;
  const data = {
    id: userId,
    userRole: role,
  };

  return res.status(200).json({ data });
});

export default authRouter;
