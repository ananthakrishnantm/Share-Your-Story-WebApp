import express from "express";
import { User } from "../models/UsersModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import generateProfilePicture from "../utils/profilePicGenerator.js";
import { createVerificationToken } from "../Services/userService.js";

dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;

const registerRouter = express.Router();

registerRouter.post("/", async (request, response) => {
  const { Name, dateOfBirth, username, email, password } = request.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ message: "Email already registered" });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // ProfilePic Generator
    const profilePictureBuffer = await generateProfilePicture(username);

    // Creating a new user with hashed password
    const user = new User({
      Name,
      dateOfBirth,
      username,
      email,
      password: hashedPassword,
      profilePicture: {
        name: `${username}_profile.png`,
        data: profilePictureBuffer,
        contentType: "image/png",
      },
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "1h",
    });

    // Cookie creation
    response.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // only use secure cookies in production
      maxAge: 3600000, // 1 hour
    });

    // Create verification token and send email
    await createVerificationToken(user);

    response.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

export default registerRouter;
