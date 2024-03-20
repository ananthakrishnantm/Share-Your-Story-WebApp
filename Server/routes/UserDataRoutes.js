import express, { request, response } from "express";
import multer from "multer";
import mongoose from "mongoose";
import authRouter from "./LoginRoutes.js";
import { User } from "../models/UsersModel.js";
import decodedToken from "../middleware/DecodingMiddleware.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { FoodBlog } from "../models/FoodBlogModel.js";

dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;

const user = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

user.use("/", decodedToken);
user.use("/", authRouter);

user.get("/Users", async (request, response) => {
  try {
    const UserData = await User.find({
      accountStatus: "active",
    })
      .select("-password")
      .select("-role");

    return response.status(200).json({ data: UserData });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//gets user id
user.get("/:userId", decodedToken, async (request, response) => {
  try {
    const userId = request.userId; // Access userId from request params

    const userData = await User.findOne({ _id: userId })
      .select("-password")
      .select("-role"); // Use findOne() instead of find()
    if (!userData) {
      return response.status(404).json({ message: "User not found" });
    }
    return response.status(200).json({
      count: 1, // Since we're querying for a single user
      data: userData,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

// to search for users
user.get("/data/search", async (req, res) => {
  const { username } = req.query;
  console.log(username);
  try {
    const users = await User.find({
      username: { $regex: username, $options: "i" },
    }).select(" -password -role");

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

user.get("/data/:userId", decodedToken, async (request, response) => {
  try {
    const userId = request.userId; // Access userId from request params
    return response.status(200).json({
      userId,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send({ message: "Internal server error" });
  }
});

//to display the profile pic of user with name
user.get("/blog/:user", async (request, response) => {
  try {
    const userId = request.params.user; // Access userIds from request params
    console.log(userId);
    const userData = await User.findById(userId)
      .select("-password")
      .select("-role"); // Use find() with $in operator to retrieve multiple users

    if (!userData) {
      return response.status(404).json({ message: "Users not found" });
    }
    // console.log(userData);
    return response.status(200).json(userData);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//edit userid
//user from decoded token

user.put(
  "/:userId",
  decodedToken,
  upload.single("profilePicture"),
  async (request, response) => {
    try {
      const userId = request.userId;

      const UserDataToUpdate = {};

      // Check if request body contains fields to update
      if (request.body.firstName) {
        UserDataToUpdate.firstName = request.body.firstName;
      }
      if (request.body.middleName) {
        UserDataToUpdate.middleName = request.body.middleName;
      }
      if (request.body.lastName) {
        UserDataToUpdate.lastName = request.body.lastName;
      }
      if (request.body.email) {
        UserDataToUpdate.email = request.body.email;
      }

      if (request.body.password) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(request.body.password, salt); // Use request.body.password here
        UserDataToUpdate.password = hashedPassword; // Assign hashed password to UserDataToUpdate
      }

      // Check if request contains profile picture
      if (request.file) {
        UserDataToUpdate.profilePicture = {
          name: request.file.originalname,
          data: request.file.buffer,
          contentType: request.file.mimetype,
        };
      }
      console.log(UserDataToUpdate);

      const filter = { _id: userId };
      const UpdatedUserData = await User.updateOne(filter, UserDataToUpdate, {
        new: true,
      });

      if (!UpdatedUserData) {
        return response.status(404).json({ message: "User not updated" });
      }

      console.log(UpdatedUserData);
      return response.status(200).json(UpdatedUserData);
    } catch (err) {
      console.log(err.message);
      response.status(500).json({ message: err.message });
    }
  }
);

//to fetch data from other user

user.get("/users/:userId/blogs", async (request, response) => {
  try {
    const userId = request.params.userId;

    console.log("Type of userId:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("invalid object id format");
      return response.status(400).json({ message: "invalid id format" });
    }
    //find and findOne can caus issue when mapping
    const Fblog = await FoodBlog.find({
      user: userId,
      isDeleted: false,
    });

    if (!Fblog) {
      console.log("blog not found");
      return response.status(404).json({ message: "BlogNotFound" });
    }
    return response.status(200).json(Fblog);
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
});

export default user;
