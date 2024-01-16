import express, { response } from "express";
import { FoodBlog } from "../models/FoodBlogModel.js";
import multer from "multer";
import { request } from "http";
import { error } from "console";
import mongoose from "mongoose";
import authRouter from "./LoginRoutes.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

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

router.use("/", authRouter);

// router.use("/", upload.single("image")); //IMP STEP
//router.use(upload.single("image"));

router.post("/uploads", upload.single("image"), async (request, response) => {
  try {
    if (!request.body.title || !request.body.content) {
      return response.status(400).send({
        message: "send all require fields:title,author,publishYear",
      });
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    const decodedToken = jwt.verify(request.body.user, secretKey);
    console.log(decodedToken);
    const userId = decodedToken.userId;
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
router.get("/", async (request, response) => {
  try {
    const Fblog = await FoodBlog.find({});
    return response.status(200).json({
      count: FoodBlog.length,
      data: Fblog,
    });
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
});
//to fetch data from single user
router.get("/user/:userId", async (request, response) => {
  // const secretKey = process.env.JWT_SECRET_KEY;
  // const decodedToken = jwt.verify(request.body.user, secretKey);
  // console.log(decodedToken);
  // const userId = decodedToken.userId;

  try {
    const { userId } = request.params;
    console.log("Fetching blog by Id...");

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      console.error("invalid object id format");
      return response.status(400).json({ message: "invalid id format" });
    }

    const Fblog = await FoodBlog.findOne({ user: userId });

    if (!Fblog) {
      console.log("blog not foud");
      return response.status(404).json({ message: "BlogNotFound" });
    }
    return response.status(200).json(Fblog);
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
});

//Route to update one file

router.put("/user/:userId", async (request, response) => {
  try {
    const { userId } = request.params;

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

    const filter = { user: userId };

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
});
//Route to delete a book

router.delete("/user/:userId", async (request, response) => {
  try {
    const { userId } = request.params;
    const filter = { user: userId };

    const result = await FoodBlog.deleteOne(filter);
    if (result.deletedCount === 0) {
      return response.status(404).json({ message: "blog not found" });
    }
    return response.status(200).json({ message: "blog deleted successfully" });
  } catch (err) {
    console.log(err.message);
    response.status(500).json({ message: err.message });
  }
});

export default router;
