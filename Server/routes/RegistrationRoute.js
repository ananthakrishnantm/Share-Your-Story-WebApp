import express from "express";
import { User } from "../models/UsersModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userRouter = express.Router();

userRouter.post("/", async (request, response) => {
  const { username, email, password } = request.body;
  try {
    //hashing the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating a new user with hashed password
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // response.redirect(`/blog/${user._id}`);
    response.status(201).json({ message: "Registration Successful" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "internal server error" });
  }
});

export default userRouter;
