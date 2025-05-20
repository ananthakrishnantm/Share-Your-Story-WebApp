import express, { request } from "express";
import mongoose from "mongoose";
import { User } from "../models/UsersModel.js";
import authRouter from "../Controller/LoginRoutes.js";
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

      // console.log("this is when the user follows");

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
        path: "followers",
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
    
      response.status(500).json({ message: "Internal server error" });
    }
  }
);

// displays all users following a user
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

//suggested followers

followerRoute.get(
  "/users/:userId/suggestedFollowers",
  decodedToken,
  async (request, response) => {
    try {
      const userId = request.userId;
      console.log("This is the userID", userId);

      // Fetch the user's following list
      const userFollowingList = await User.findById(userId)
        .where({ accountStatus: "active" })
        .select("-password")
        .populate({
          path: "following",
          select: "username profilePicture",
          populate: {
            path: "profilePicture",
            select: "name contentType",
          },
        });

      if (!userFollowingList) {
        return response.status(404).json({ message: "User not found" });
      }

      const followingIds = new Set(
        userFollowingList.following.map((f) => f._id.toString())
      );
      const followingUserIds = userFollowingList.following.map(
        (user) => user._id
      );

      // Fetch the logged-in user's blocked users list
      const loggedInUser = await User.findById(userId);
      const blockedUsers = loggedInUser.blockedUsers.map((id) => id.toString());

      // console.log("Blocked Users Array", blockedUsers);

      const suggestionsSet = new Set();

      // Fetch users followed by those the logged-in user is following
      const usersFollowedByFollowing = await User.find({
        _id: { $in: followingUserIds },
        accountStatus: "active",
      }).populate("following", "username profilePicture");

      usersFollowedByFollowing.forEach((user) => {
        user.following.forEach((followedUserofFollowedUser) => {
          const followedUserId = followedUserofFollowedUser._id.toString();

          // Check if the user is not the logged-in user, not already followed, and not blocked
          if (
            followedUserId !== userId &&
            !followingIds.has(followedUserId) &&
            !blockedUsers.includes(followedUserId)
          ) {
            suggestionsSet.add(followedUserofFollowedUser);
          }
        });
      });

      // Limit the suggestions to 10
      const suggestions = Array.from(suggestionsSet).slice(0, 10);

      response.json(suggestions);
    } catch (error) {
      console.log(error);
      response.status(500).json({ message: "Internal server error" });
    }
  }
);

//route to unfollow
followerRoute.delete(
  "/blog/users/:userId/:userToUnFollowId",
  decodedToken,
  async (request, response) => {
    try {
      const userId = request.userId;
      const userToUnfollowId = request.params.userToUnFollowId;

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
