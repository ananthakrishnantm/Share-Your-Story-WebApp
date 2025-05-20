import express, { response } from "express";
import { FoodBlog } from "../models/FoodBlogModel.js";
import multer from "multer";
import { User } from "../models/UsersModel.js";
import mongoose from "mongoose";
import authRouter from "../Controller/LoginRoutes.js";
import decodedToken from "../middleware/DecodingMiddleware.js";
import {
  getPaginatedBlogs,
  getPaginatedBlogsByOtherUser,
  getPaginatedBlogsByUser,
  getPaginatedFollowingBlogList,
} from "../Controller/Pagination.js";

//in order to use express router
//import express, declare express router
//to a varaible fr eg here const router

const router = express.Router();

//use multer.memoryStorage() for temporary storage of data
//setting up multer(middleware) for uploading files ie BINARY FILES

// this section is important to upload form-file information
//router.use("/", upload.single("image")); the "/" path/route determines
//from where multer take effect
//FORM-DATA FROM POSTMAN WONT WORK IF MULTER NOT SET UP PROPERLY
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//use upload as in the html methode to update or add new files.

router.use("/", decodedToken);

router.use("/", authRouter);

// router.use("/", upload.single("image")); //IMP STEP
//router.use(upload.single("image"));

//uplaoding new blog
router.post("/uploads", upload.single("image"), async (request, response) => {
  try {
    if (!request.body.title && (!request.body.content || !request.body.image)) {
      return response.status(400).send({
        message: "send all require fields:title,author,publishYear",
      });
    }
    const userId = request.userId;
    const newBlog = {
      title: request.body.title,
      content: request.body.content,
      user: userId,
    };
    // console.log(newBlog);
    if (request.file) {
      newBlog.image = {
        name: request.file.originalname, //originalname gives the name of the image file to db
        data: request.file.buffer, //converts the image to Binary.createFromBase64 and stores in db
        contentType: request.file.mimetype, //it save the filetype and extension
      };
    }

    const Fblog = await FoodBlog.create(newBlog);

    await User.findByIdAndUpdate(userId, { $inc: { blogCount: 1 } });

    return response.status(201).send(Fblog);
    //below is catch don't get confused dumbass.
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
});
//it displays all the blogs
router.get("/", decodedToken, async (request, response) => {
  try {
    const offset = parseInt(request.query.offset) || 0;
    const limit = parseInt(request.query.limit) || 5;

    const loggedInUserId = request.userId;

    // Get paginated blogs with filtering based on blocked users
    const blogs = await getPaginatedBlogs(offset, limit, loggedInUserId);

    return response.status(200).json({
      count: blogs.length, // Assuming you want to return the count of filtered blogs
      data: blogs,
    });
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
});

//to fetch list of blogs the user follow
//the array is fetched from the body

router.get("/following/:userId/userlist", async (request, response) => {
  try {
    const userId = request.userId;

    const userList = await User.findById(userId).populate("following");
    const followedUserIds = userList.following.map((user) => user._id);

    const offset = parseInt(request.query.offset) || 0;
    const limit = parseInt(request.query.limit) || 4;

    const { blogs, count } = await getPaginatedFollowingBlogList(
      followedUserIds,
      offset,
      limit
    );
    // console.log("blog", blogs);
    return response.status(200).json({ count, data: blogs });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//to display the profile pic of user with name
//to fetch data from single user who logged in
router.get("/user/:userId/blogs", async (request, response) => {
  try {
    const userId = request.userId;
    const offset = parseInt(request.query.offset) || 0;
    const limit = parseInt(request.query.limit) || 5;

    // console.log("offset", request.query.offset);
    // console.log("limit", request.query.limit);

    // console.log("Type of userId:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("invalid object id format");
      return response.status(400).json({ message: "invalid id format" });
    }

    //find and findOne can cause issue when mapping
    //find sends an array findbyId sends object
    const { blogs, count } = await getPaginatedBlogsByUser(
      userId,
      offset,
      limit
    );
    return response.status(200).json({
      count,
      data: blogs,
    });
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
});

//to get the blogs of other users not used anywhere
router.get("/:userId/blogs", async (request, response) => {
  try {
    const userId = request.params.userId;
    const offset = parseInt(request.query.offset) || 0;
    const limit = parseInt(request.query.limit) || 5;
    

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("invalid object id format");
      return response.status(400).json({ message: "invalid id format" });
    }
    //find and findOne can cause issue when mapping
    //find sends an array findbyId sends object
    const { UserDetails, blogs, count } = await getPaginatedBlogsByOtherUser(
      userId,
      offset,
      limit
    );

    if (!blogs) {
      console.log("blog not found");
      return response.status(404).json({ message: "BlogNotFound" });
    }

    return response
      .status(200)
      .json({ count, data: blogs, userData: UserDetails });
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
});

//Route to get one blog of  of others users
router.get("/otherUser/:userId/blogs/:blogId", async (request, response) => {
  try {
    const { userId } = request.params;

    const { blogId } = request.params;
    // console.log("userID", userId), console.log("blogID", blogId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("invalid object id format");
      return response.status(400).json({ message: "invalid id format" });
    }

    const data = await FoodBlog.findOne({
      _id: blogId,
      user: userId,
      isDeleted: false,
    });

    // console.log("data", data);
    if (!data) {
      console.log("blog not found");
      return response.status(404).json({ message: "BlogNotFound" });
    }
    return response.status(200).json({ data });
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
});

//Route to update one file
router.put(
  "/user/:userId/blogs/:blogId",
  upload.single("image"),
  async (request, response) => {
    try {
      const userId = request.userId;
      const { blogId } = request.params;

      // console.log(userId);
      // console.log(blogId);

      const updatedData = {
        title: request.body.title,
        content: request.body.content,
      };
      // console.log(updatedData);
      if (request.file) {
        updatedData.image = {
          name: request.file.originalname, //originalname gives the name of the image file to db
          data: request.file.buffer, //converts the image to Binary.createFromBase64 and stores in db
          contentType: request.file.mimetype, //it save the filetype and extension
        };
      }

      const filter = { user: userId, _id: blogId };
      const updatedBlog = await FoodBlog.updateOne(filter, updatedData, {
        new: true,
      });

      if (!updatedBlog) {
        return response.status(404).json({ message: "blog not updated" });
      }
   
      return response.status(200).json(updatedBlog);
    } catch (err) {
      console.log(error.message);
      response.status(500).json({ message: err.message });
    }
  }
);

//Route to View a single Blog
router.get("/user/:userId/blogs/:blogId", async (request, response) => {
  try {
    const userId = request.userId;
    // console.log("this is the suer id that i called", userId);
    const { blogId } = request.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("invalid object id format");
      return response.status(400).json({ message: "invalid id format" });
    }

    const data = await FoodBlog.findOne({
      _id: blogId,
      user: userId,
      isDeleted: false,
    });

    // console.log(data);

    if (!data) {
      console.log("blog not found");
      return response.status(404).json({ message: "BlogNotFound" });
    }
    return response.status(200).json({ data });
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
});

//Route to delete a blog

router.delete("/user/:userId/blogs/:blogId", async (request, response) => {
  try {
    const userId = request.userId;
    const { blogId } = request.params;

    const filter = { _id: blogId };
    const result = await FoodBlog.updateOne(filter, {
      $set: { isDeleted: true },
    });
    if (result.deletedCount === 0) {
      return response
        .status(404)
        .json({ message: "Blog not found or already deleted" });
    }
    await User.findByIdAndUpdate(userId, { $inc: { blogCount: -1 } });
    return response.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.log(err.message);
    response.status(500).json({ message: "Internal server error" });
  }
});

//Route to display the blogs
router.get(
  "/user/blogs/:blogId/viewCount",
  decodedToken,
  async (request, response) => {
    try {
      const { blogId } = request.params;


      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return response.status(400).json({ message: "invalid id format" });
      }

      const blog = await FoodBlog.findById(blogId);
      if (!blog) {
        return response.status(404).json({ message: "Blog not found" });
      }

      return response.status(200).json(blog.views.length);
    } catch (error) {
      return response.status(500).json({ message: "internal server error" });
    }
  }
);

//Route to post displayVies for blog
router.post(
  "/user/:userId/blogs/:blogId/views",
  decodedToken,
  async (request, response) => {
    console.log("post request received");
    try {
      const userId = request.userId;
      const { blogId } = request.params;
      // console.log("this is the user id", userId);
      // console.log("this is the blog id", blogId);

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log("invalid object id format");
        return response.status(400).json({ message: "invalid id format" });
      }
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return response.status(400).json({ message: "invalid id format" });
      }
      const blog = await FoodBlog.findById(blogId);
      if (!blog) {
        return response.status(404).json({ message: "Blog not found" });
      }
      const now = new Date();
      const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);

      const existingView = blog.views.find(
        (view) =>
          view.userId.toString() === userId && view.timestamp > oneDayAgo
      );
      // console.log(existingView);

      if (!existingView) {
        blog.views.push({ userId, timestamp: now });
        await blog.save();
      }

      return response.status(200).json({ message: "view recorded" });
    } catch (error) {
      console.log("Error:", error.message);
      response.status(500).json({ message: error.message });
    }
  }
);

//Route to like a blog
router.put(
  "/user/:userId/blogs/:blogId/like",
  decodedToken,
  async (request, response) => {
    try {
      const userId = request.userId;
      const { blogId } = request.params;
      const { action } = request.body;

      // Ensure that action is either 'like' or 'unlike'
      if (action !== "like" && action !== "unlike") {
        return response.status(400).json({ message: "Invalid action" });
      }

      // Validate blogId
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return response.status(400).json({ message: "Invalid blogId" });
      }

      const filter = { _id: blogId };

      // Retrieve the blog post
      let blog = await FoodBlog.findById(filter);

      if (!blog) {
        return response.status(404).json({ message: "Blog not found" });
      }

      // Check if the user has already liked the blog post
      const alreadyLiked =
        blog.likes &&
        blog.likes.some((like) => like.user.toString() === userId);

      blog.likes = blog.likes ?? [];

      // Update the likes array based on the action
      if (action === "like" && !alreadyLiked) {
        blog.likes.push({ user: userId });
      } else if (action === "like" && alreadyLiked) {
        blog.likes = blog.likes.filter(
          (like) => like.user.toString() !== userId
        );
      }

      // Update the likesCount based on the updated likes array length
      blog.likesCount = blog.likes.length;

      // Save the updated blog post
      const updatedBlog = await blog.save();

      return response.status(200).json(updatedBlog);
    } catch (err) {
      console.error(err.message);
      response.status(500).json({ message: "Internal server error" });
    }
  }
);

//Route to display the like
router.get(
  "/user/:userId/blogs/:blogId/like",
  decodedToken,
  async (request, response) => {
    try {
      const { userId } = request.userId;
      const { blogId } = request.params;

      // console.log(userId);
      // console.log(blogId);

      // Validate blogId
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return response.status(400).json({ message: "Invalid blogId" });
      }

      const filter = { _id: blogId };
      const blog = await FoodBlog.find(filter);

      if (!blog) {
        return response.status(404).json({ message: "blog not found" });
      }
      // console.log(blog);
      return response.status(200).json(blog);
    } catch (err) {
      console.log(err.message);
      response.status(500).json({ message: "Internal server error" });
    }
  }
);

//to add new comments
router.post(
  "/user/:userId/blogs/:blogId/postcomments",
  decodedToken,
  async (request, response) => {
    try {
      const userId = request.userId;
      const { blogId } = request.params;
      const { commentText } = request.body;
      // Validate blogId
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return response.status(400).json({ message: "Invalid blogId" });
      }

      // Retrieve the blog post
      let blog = await FoodBlog.findById(blogId);

      if (!blog) {
        return response.status(404).json({ message: "Blog not found" });
      }

      // Add the comment to the blog post
      blog.comments.push({ user: userId, content: commentText });

      // Update the commentsCount based on the updated comments array length
      blog.commentsCount = blog.comments.length;

      // Save the updated blog post
      const updatedBlog = await blog.save();

      return response.status(200).json(updatedBlog);
    } catch (err) {
      console.error(err.message);
      response.status(500).json({ message: "Internal server error" });
    }
  }
);

// // Route to get comments for a specific blog post
// router.get(
//   "/user/:userId/blogs/:blogId/comments/",
//   decodedToken,
//   async (request, response) => {
//     try {
//       const { blogId } = request.params;
//       const userId = request.userId;
//       // Validate blogId
//       if (!mongoose.Types.ObjectId.isValid(blogId)) {
//         return response.status(400).json({ message: "Invalid blogId" });
//       }

//       // Retrieve the blog post
//       const filter = { _id: blogId };
//       const blog = await FoodBlog.find(filter);

//       if (!blog) {
//         return response.status(404).json({ message: "Blog not found" });
//       }

//       // Return the comments for the blog post
//       //adding the { data:blog }
//       return response.status(200).json({ data: blog });
//     } catch (err) {
//       console.error(err.message);
//       response.status(500).json({ message: "Internal server error" });
//     }
//   }
// );

router.get(
  "/user/blogs/:blogId/comments/",
  decodedToken,
  async (request, response) => {
    try {
      const { blogId } = request.params;

      // Validate blogId
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return response.status(400).json({ message: "Invalid blogId" });
      }

      // Aggregate to join comments with user information and include blog owner
      const blog = await FoodBlog.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(blogId) } },
        {
          $lookup: {
            from: "users", // Assuming your user model collection is named 'users'
            localField: "user", // Field in the blog document that references the user
            foreignField: "_id", // Field in the users collection that is the user ID
            as: "blogOwner",
          },
        },
        { $unwind: "$blogOwner" },
        {
          $lookup: {
            from: "users", // Assuming your user model collection is named 'users'
            localField: "comments.user", // Field in the comments array that references the user
            foreignField: "_id", // Field in the users collection that is the user ID
            as: "commentUser",
          },
        },
        {
          $addFields: {
            comments: {
              $map: {
                input: "$comments",
                as: "comment",
                in: {
                  _id: "$$comment._id",
                  content: "$$comment.content",
                  user: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$commentUser",
                          as: "user",
                          cond: { $eq: ["$$user._id", "$$comment.user"] },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            content: 1,
            user: {
              _id: "$blogOwner._id",
              name: "$blogOwner.name",
              profilePicture: "$blogOwner.profilePicture",
            },
            comments: {
              _id: 1,
              content: 1,
              user: {
                _id: 1,
                name: 1,
                profilePicture: 1,
              },
            },
          },
        },
      ]);

      if (blog.length === 0) {
        return response.status(404).json({ message: "Blog not found" });
      }

      // Return the blog with comments and user data
      return response.status(200).json({ data: blog });
    } catch (err) {
      console.error(err.message);
      response.status(500).json({ message: "Internal server error" });
    }
  }
);

// Route to edit a comment in a specific blog post
router.put(
  "/user/:userId/blogs/:blogId/comments/:commentId",

  async (request, response) => {
    try {
      const { blogId, commentId } = request.params;
      const { commentText } = request.body; // Updated comment content

      // Validate blogId and commentId
      if (
        !mongoose.Types.ObjectId.isValid(blogId) ||
        !mongoose.Types.ObjectId.isValid(commentId)
      ) {
        return response
          .status(400)
          .json({ message: "Invalid blogId or commentId" });
      }

      // Retrieve the blog post
      const blog = await FoodBlog.findById(blogId);

      if (!blog) {
        return response.status(404).json({ message: "Blog not found" });
      }

      // Find the comment in the comments array and update its content
      const comment = blog.comments.find(
        (comment) => comment._id.toString() === commentId
      );

      if (!comment) {
        return response.status(404).json({ message: "Comment not found" });
      }

      // Update the content of the comment
      comment.content = commentText;

      // Save the updated blog post
      const updatedBlog = await blog.save();

      return response.status(200).json(updatedBlog);
    } catch (err) {
      console.error(err.message);
      response.status(500).json({ message: "Internal server error" });
    }
  }
);

// Route to delete a comment from a specific blog post
router.delete(
  "/user/:userId/blogs/:blogId/comments/:commentId",
  async (request, response) => {
    try {
      const { blogId, commentId } = request.params;

      // Validate blogId and commentId
      if (
        !mongoose.Types.ObjectId.isValid(blogId) ||
        !mongoose.Types.ObjectId.isValid(commentId)
      ) {
        return response
          .status(400)
          .json({ message: "Invalid blogId or commentId" });
      }

      // Retrieve the blog post
      const blog = await FoodBlog.findById(blogId);

      if (!blog) {
        return response.status(404).json({ message: "Blog not found" });
      }

      // Find the comment in the comments array and remove it
      const commentIndex = blog.comments.findIndex(
        (comment) => comment._id.toString() === commentId
      );

      if (commentIndex === -1) {
        return response.status(404).json({ message: "Comment not found" });
      }

      blog.comments.splice(commentIndex, 1);

      // Update the commentsCount based on the updated comments array length
      blog.commentsCount = blog.comments.length;

      // Save the updated blog post
      const updatedBlog = await blog.save();

      return response.status(200).json(updatedBlog);
    } catch (err) {
      console.error(err.message);
      response.status(500).json({ message: "Internal server error" });
    }
  }
);

export default router;
