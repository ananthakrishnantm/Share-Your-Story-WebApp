import express, { request, response } from "express";
import multer from "multer";
import mongoose from "mongoose";
import authRouter from "../Controller/LoginRoutes.js";
import { User } from "../models/UsersModel.js";
import decodedToken from "../middleware/DecodingMiddleware.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { getPaginatedBlogsByUser } from "../Controller/Pagination.js";

dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY;

const user = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//decoded token protects the path
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

//to display the profile pic of any user with name
user.get("/blog/:user", async (request, response) => {
  try {
    const userId = request.params.user; // Access userIds from request params
    // console.log("this is userid", userId);
    const userData = await User.findById(userId)
      .select("-password")
      .select("-role"); // Use find() with $in operator to retrieve multiple users

    if (!userData) {
      return response.status(404).json({ message: "Users not found" });
    }
    // console.log("this is the userdata", userData);
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
      if (request.body.Name) {
        UserDataToUpdate.Name = request.body.Name;
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

    const offset = parseInt(request.query.offset) || 0;
    const limit = parseInt(request.query.limit) || 5;

    // console.log("offset", request.query.offset);
    // console.log("limit", request.query.limit);
    // console.log("NewuserId", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("invalid object id format");
      return response.status(400).json({ message: "invalid id format" });
    }
    //find and findOne can caus issue when mapping

    const { blogs, count } = await getPaginatedBlogsByUser(
      userId,
      offset,
      limit
    );
    // const Fblog = await FoodBlog.find({
    //   user: userId,
    //   isDeleted: false,
    // });

    // if (!Fblog) {
    //   console.log("blog not found");
    //   return response.status(404).json({ message: "BlogNotFound" });
    // }

    // console.log("data list", blogs);
    return response.status(200).json({
      count,
      data: blogs,
    });
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
});

user.post("/block/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const loggedInUserId = request.userId;

    const user = await User.findById(loggedInUserId);
    const userToBlock = await User.findById(userId);

    if (user.blockedUsers.includes(userId)) {
      return response.status(400).json({ message: "User already blocked" });
    }

    user.blockedUsers.push(userId);
    userToBlock.blockedBy.push(loggedInUserId);

    // Remove the user from following and followers arrays
    user.following = user.following.filter((id) => id.toString() !== userId);
    userToBlock.followers = userToBlock.followers.filter(
      (id) => id.toString() !== loggedInUserId
    );

    await user.save();
    await userToBlock.save();

    response.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

user.delete("/unblock/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const loggedInUserId = request.userId;

    const user = await User.findById(loggedInUserId);
    const userToUnblock = await User.findById(userId);

    // Remove the userId from the logged-in user's blockedUsers array
    user.blockedUsers = user.blockedUsers.filter(
      (blockedUserId) => blockedUserId.toString() !== userId.toString()
    );

    // Remove the logged-in userId from the userToUnblock's blockedBy array
    userToUnblock.blockedBy = userToUnblock.blockedBy.filter(
      (blockedUserId) => blockedUserId.toString() !== loggedInUserId.toString()
    );

    await user.save();
    await userToUnblock.save();

    response.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

user.get("/blockedlist", decodedToken, async (request, response) => {
  try {
    const loggedInUserId = request.userId;

    const userList = await User.findById(loggedInUserId).populate(
      "blockedUsers",
      "username"
    );

    response.status(200).json({ blockedUsers: userList.blockedUsers });
  } catch (error) {
    console.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

user.put("/banned/:userId", async (request, response) => {
  const { userId } = request.params;
  console.log("this is hte banned userId", userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    user.isBanned = true;
    await user.save();
    response.status(200).json({ message: "User banned successfully" });
  } catch (error) {
    console.log("this is the error", error);
    response.status(500).json("internal server error");
  }
});

user.put("/unban/:userId", async (request, response) => {
  const { userId } = request.params;
  console.log("this is hte banned userId", userId);
  try {
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }
    user.isBanned = false;
    await user.save();
    response.status(200).json({ message: "User unbanned successfully" });
  } catch (error) {
    response.status(500).json("internal server error");
  }
});

user.get("/users/banned", async (request, response) => {
  try {
    const bannedUserList = await User.find({ isBanned: true })
      .select("-password")
      .select("-role");
    console.log(bannedUserList);

    response.status(200).json({ data: bannedUserList });
  } catch (error) {
    console.error("Error fetching banned users:", error);
    response.status(500).json({ error: "Internal server error" });
  }
});

export default user;
