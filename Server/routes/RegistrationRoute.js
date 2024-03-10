import express from "express";
import { User } from "../models/UsersModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authRouter from "./LoginRoutes.js";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;

const registerRouter = express.Router();
// userRouter.use("/", authRouter);

registerRouter.post("/", async (request, response) => {
  const {
    firstName,
    middleName,
    lastName,
    dateOfBirth,
    username,
    email,
    password,
  } = request.body;
  try {
    //hashing the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    //creating a new user with hashed password
    const user = await User.create({
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      username,
      email,
      password: hashedPassword,
    });
    //generate JSWT token
    const token = jwt.sign({ userId: user._id }, secretKey);
    console.log(token);

    //cookie creation

    response.cookie("cookie", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
    });

    // response.redirect(`/blog/${user._id}`);
    response.status(201).json({ message: "Registration Successful" });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "internal server error" });
  }
});

export default registerRouter;
