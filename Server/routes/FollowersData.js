import express from "express";
import mongoose from "mongoose";
import { User } from "../models/UsersModel.js";
import authRouter from "./LoginRoutes.js";
import decodedToken from "../middleware/DecodingMiddleware.js";

const followerRoute = express.Router();

followerRoute.use("/", authRouter);

//adding follow option
followerRoute.post(
  "/blog/users/:userId/follow",
  decodedToken,
  async (request, response) => {
    try {
      const userId = request.userId;
      const userToFollowId = request.body.userToFollowId;
      console.log(userId);

      const user = await User.findById(userId);
      const userToFollow = await User.findById(userToFollowId);

      if (!user || !userToFollow) {
        return response.status(404).json({ message: "User not found" });
      }
      if (user.following.includes(userToFollowId)) {
        return response
          .status(400)
          .json({ message: "Already following this user" });
      }

      user.following.push(userToFollowId);
      userToFollow.followers.push(userId);

      await user.save();
      await userToFollow.save();

      response.json({ message: "User followed successfully" });
    } catch (error) {
      console.log(error);
      response.status(500).json({ message: "Internal server error" });
    }
  }
);

// Get followers of a user
followerRoute.get(
  "/blog/users/:userId/followers",
  decodedToken,
  async (request, response) => {
    try {
      const userId = request.userId;
      const user = await User.findById(userId).populate({
        path: "following",
        select: "username profilePicture",
        populate: {
          path: "profilePicture",
          select: "name contentType",
        },
      });

      if (!user) {
        return response.status(404).json({ message: "User not found" });
      }
      response.json(user.followers);
    } catch (err) {
      console.error(err);
      response.status(500).json({ message: "Internal server error" });
    }
  }
);

// Get users followed by a user
followerRoute.get(
  "/blog/users/:userId/following",
  decodedToken,
  async (request, response) => {
    try {
      const userId = request.userId;
      const user = await User.findById(userId).populate({
        path: "following",
        select: "username profilePicture",
        populate: {
          path: "profilePicture",
          select: "name contentType",
        },
      });
      if (!user) {
        return response.status(404).json({ message: "User not found" });
      }
      response.json(user.following);
    } catch (err) {
      console.error(err);
      response.status(500).json({ message: "Internal server error" });
    }
  }
);

followerRoute.delete(
  "/blog/users/:userId/:followerId",
  decodedToken,
  async (request, response) => {
    try {
      const userId = request.userId;
      const userToUnfollowId = request.params.followerId;

      console.log(userToUnfollowId);

      const user = await User.findById(userId);
      const userToUnfollow = await User.findById(userToUnfollowId);

      console.log("first:", userId);
      console.log("second:", userToUnfollowId);

      if (!user || !userToUnfollow) {
        return response.status(404).json({ message: "User not found" });
      }

      user.following = user.following.filter(
        (id) => id.toString() !== userToUnfollowId.toString()
      );
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (id) => id.toString() !== userId.toString()
      );

      await user.save();
      await userToUnfollow.save();

      console.log("User Following After Unfollow:", user.following);

      return response.json({ message: "User unfollowed successfully" });
    } catch (error) {
      console.error("Error occurred while unfollowing user:", error);
      return response.status(500).json({ message: "Failed to unfollow user" });
    }
  }
);

export default followerRoute;
