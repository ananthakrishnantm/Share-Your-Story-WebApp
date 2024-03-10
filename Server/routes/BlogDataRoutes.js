import express, { response } from "express";
import { FoodBlog } from "../models/FoodBlogModel.js";
import multer from "multer";
import { request } from "http";
import { error } from "console";
import mongoose from "mongoose";
import authRouter from "./LoginRoutes.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import decodedToken from "../middleware/DecodingMiddleware.js";

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
    console.log(newBlog);
    if (request.file) {
      newBlog.image = {
        name: request.file.originalname, //originalname gives the name of the image file to db
        data: request.file.buffer, //converts the image to Binary.createFromBase64 and stores in db
        contentType: request.file.mimetype, //it save the filetype and extension
      };
    }

    const Fblog = await FoodBlog.create(newBlog);
    return response.status(201).send(Fblog);
    //below is catch don't get confused dumbass.
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
});
router.get("/", decodedToken, async (request, response) => {
  try {
    const Fblog = await FoodBlog.find({
      isDeleted: false,
    });
    return response.status(200).json({
      count: FoodBlog.length,
      data: Fblog,
    });
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
});

//to display the profile pic of user with name

//to fetch data from single user
router.get("/user/:userId/blogs", async (request, response) => {
  try {
    const userId = request.userId;

    // console.log("Type of userId:", userId);

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("invalid object id format");
      return response.status(400).json({ message: "invalid id format" });
    }
    //find and findOne can cause issue when mapping
    //find sends an array findbyId sends object
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

//Route to update one file
router.put(
  "/user/:userId/blogs/:blogId",
  upload.single("image"),
  async (request, response) => {
    try {
      const userId = request.userId;
      const { blogId } = request.params;

      console.log(userId);
      console.log(blogId);

      const updatedData = {
        title: request.body.title,
        content: request.body.content,
      };
      console.log(updatedData);
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
      console.log(updatedBlog);
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
    const { blogId } = request.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("invalid object id format");
      return response.status(400).json({ message: "invalid id format" });
    }

    const data = await FoodBlog.find({
      _id: blogId,
      user: userId,
      isDeleted: false,
    });

    console.log(data);

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
    const { userId } = request.userId;
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
    return response.status(200).json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.log(err.message);
    response.status(500).json({ message: "Internal server error" });
  }
});

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
  "/user/:userId/blogs/:blogId/comments",
  decodedToken,
  async (request, response) => {
    try {
      const userId = request.userId;
      const { blogId } = request.params;
      const { commentText } = request.body;
      console.log(commentText);
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

// Route to get comments for a specific blog post
router.get(
  "/user/:userId/blogs/:blogId/comments/",
  decodedToken,
  async (request, response) => {
    try {
      const { blogId } = request.params;
      const userId = request.userId;
      // Validate blogId
      if (!mongoose.Types.ObjectId.isValid(blogId)) {
        return response.status(400).json({ message: "Invalid blogId" });
      }

      // Retrieve the blog post
      const filter = { _id: blogId };
      const blog = await FoodBlog.find(filter);

      if (!blog) {
        return response.status(404).json({ message: "Blog not found" });
      }

      // Return the comments for the blog post
      //adding the { data:blog }
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

      return response.status(200).json(updatedBlog, {});
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
