import mongoose from "mongoose";
import { FoodBlog } from "../models/FoodBlogModel.js";
import { User } from "../models/UsersModel.js";

// export const getPaginatedBlogs = async (offset, limit) => {
//   try {
//     const blogs = await FoodBlog.find({ isDeleted: false })
//       .sort({ createdAt: -1 })
//       .skip(offset)
//       .limit(limit);
//     const count = await FoodBlog.countDocuments({ isDeleted: false });
//     return { blogs, count };
//   } catch (error) {
//     throw error;
//   }
// };

export const getPaginatedBlogs = async (offset, limit, loggedInUserId) => {
  try {
    // Fetch the logged-in user's blocked users list
    const loggedInUser = await User.findById(loggedInUserId, {
      blockedUsers: 1,
    });

    const blockedUsers = loggedInUser
      ? loggedInUser.blockedUsers.map((id) => new mongoose.Types.ObjectId(id))
      : [];

    // Fetch the blogs excluding those from blocked or banned users
    const blogs = await FoodBlog.aggregate([
      {
        $match: {
          isDeleted: false, // Ensure the blog is not deleted
        },
      },
      {
        $lookup: {
          from: "users", // Join with users collection
          localField: "user", // Match blog's user field
          foreignField: "_id", // Match with users' _id
          as: "userDetails", // Output user details in "userDetails"
        },
      },
      { $unwind: "$userDetails" }, // Unwind the array of user details
      {
        $match: {
          "userDetails.isBanned": false, // Exclude blogs from banned users
          "userDetails._id": { $nin: blockedUsers }, // Exclude blogs from blocked users
        },
      },
      { $sort: { createdAt: -1 } }, // Sort blogs by creation date
      { $skip: offset }, // Apply pagination: skip the offset
      { $limit: limit }, // Limit the number of results
      {
        $project: {
          // Project specific fields
          title: 1,
          content: 1,
          image: 1,
          user: 1,
          createdAt: 1,
          views: 1,
          "userDetails.username": 1,
          "userDetails.profilePicture": 1,
        },
      },
    ]);

    // Count the total number of blogs (excluding those from blocked or banned users)
    const count = await FoodBlog.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "users", // Join with users collection
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" }, // Unwind the array of user details
      {
        $match: {
          "userDetails.isBanned": false, // Exclude banned users
          "userDetails._id": { $nin: blockedUsers }, // Exclude blocked users
        },
      },
      {
        $count: "totalBlogs", // Count the matching documents
      },
    ]);

    return { blogs, count: count[0]?.totalBlogs || 0 }; // Return blogs and count
  } catch (error) {
    console.error("Error fetching paginated blogs:", error);
    throw error; // Re-throw the error to handle it in the caller function
  }
};

export const getPaginatedBlogsByUser = async (userId, offset, limit) => {
  try {
    const blogs = await FoodBlog.find({ isDeleted: false, user: userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    const count = await FoodBlog.countDocuments({
      isDeleted: false,
      user: userId,
    });
    return { blogs, count };
  } catch (error) {
    throw error;
  }
};

export const getPaginatedBlogsByOtherUser = async (userId, offset, limit) => {
  console.log("thi is the userID inside function", userId);
  console.log("this is the offset inside function", offset);
  console.log("this is the limit inside function", limit);
  try {
    const blogs = await FoodBlog.find({ isDeleted: false, user: userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    const UserDetails = await User.findOne({
      accountStatus: "active",
      _id: userId,
    })
      .select("-password")
      .skip(offset)
      .limit(limit);
    const count = await FoodBlog.countDocuments({
      isDeleted: false,
      user: userId,
    });

    return { blogs, count, UserDetails };
  } catch (error) {
    throw error;
  }
};

// export const getPaginatedBlogsByOtherUser = async (userId, offset, limit) => {
//   console.log("thi is the userID inside function", userId);

//   try {
//     const userIdObjectId = new mongoose.Types.ObjectId(userId);
//     const blogs = await FoodBlog.aggregate([
//       {
//         $match: {
//           user: userIdObjectId, //$in is for array for single user we can use $eq
//           isDeleted: false,
//         },
//       },
//       { $sort: { createdAt: -1 } },
//       { $skip: offset },
//       { $limit: limit },
//       {
//         $lookup: {
//           from: "users",
//           localField: "user",
//           foreignField: "_id",
//           as: "userDetails",
//         },
//       },
//       { $unwind: "$userDetails" },
//       {
//         $project: {
//           title: 1,
//           content: 1,
//           image: 1,

//           user: 1,
//           createdAt: 1,
//           "userDetails.username": 1,
//           "userDetails.profilePicture": 1,
//           "userDetails.followers": 1,
//           "userDetails.following": 1,
//           "userDetails.blogCount": 1,
//         },
//       },
//     ]);
//     const count = await FoodBlog.countDocuments({
//       user: userId,
//       isDeleted: false,
//     });
//     console.log("blogData", blogs);
//     return { blogs, count };
//   } catch (error) {
//     throw error;
//   }
// };

export const getPaginatedComments = async (userId, offset, limit) => {
  try {
    const blogs = await FoodBlog.findById(blogId)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
    const count = await FoodBlog.countDocuments({
      isDeleted: false,
      user: userId,
    });
    return { blogs, count };
  } catch (error) {
    throw error;
  }
};

//aggregate and pagination of following users blog
export const getPaginatedFollowingBlogList = async (user, offset, limit) => {
  try {
    const blogs = await FoodBlog.aggregate([
      {
        $match: {
          user: { $in: user },
          isDeleted: false,
        },
      },
      { $sort: { createdAt: -1 } },
      { $skip: offset },
      { $limit: limit },
      {
        $lookup: {
          from: "users", // the collection name in MongoDB
          localField: "user", //local field in the blog collection
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      {
        $project: {
          title: 1,
          content: 1,
          image: 1,
          user: 1,
          createdAt: 1,
          "userDetails.username": 1,
          "userDetails.profilePicture": 1,
        },
      },
    ]);
    const count = await FoodBlog.countDocuments({
      user: { $in: user },
      isDeleted: false,
    });

    return { blogs, count };
  } catch (error) {
    throw error;
  }
};
