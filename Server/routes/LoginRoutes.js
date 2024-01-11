import express, { request, response } from "express";
import { Users } from "../models/UsersModel.js";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const authRouter = express.Router();

authRouter.post("/", async (request, response) => {
  const { email, password } = request.body;

  try {
    const user = await Users.findOne({ email });
    console.log(user);

    if (!user) {
      return response.status(404).json({ message: "invalid username" });
    }

    //comparing the provided password with stored one

    const savedPassword = await bcrypt.compare(password, user.password);

    if (!savedPassword) {
      return response.status(401).json({ message: "invalid password" });
    }

    //user authenticated,generate JWT token.

    const token = jwt.sign({ userId: user._id }, "your-key", {
      expiresIn: "1h",
    });

    return response.status(200).json({ message: "Login Successful", token });
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: "internal server error" });
  }
});

export default authRouter;
