import express, { response } from "express";
import { FoodBlog } from "../models/FoodBlogModel.js";
import multer from "multer";
import { request } from "http";
import { error } from "console";
import mongoose from "mongoose";

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
router.use("/", upload.single("image")); //IMP STEP
//

router.post("/uploads", async (request, response) => {
  try {
    if (!request.body.title || !request.body.content) {
      return response.status(400).send({
        message: "send all require fields:title,author,publishYear",
      });
    }

    const newBlog = {
      title: request.body.title,
      content: request.body.content,
      image: {
        name: request.file.originalname, //originalname gives the name of the image file to db
        data: request.file.buffer, //converts the image to Binary.createFromBase64 and stores in db
        contentType: request.file.mimetype, //it save the filetype and extension
      },
    };

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

router.get("/:id", async (request, response) => {
  try {
    const { id } = request.params;
    console.log("Fetching blog by Id...");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("invalid object id format");
      return response.status(400).json({ message: "invalid id format" });
    }

    const Fblog = await FoodBlog.findById(id);

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

router.put("/:id", async (request, response) => {
  try {
    const { id } = request.params;

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

    const updatedBlog = await FoodBlog.findByIdAndUpdate(id, updatedData, {
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

router.delete("/:id", async (request, response) => {
  try {
    const { id } = request.params;

    const result = await FoodBlog.findByIdAndDelete(id);
    if (!result) {
      return response.status(404).json({ message: "blog not found" });
    }
    return response.status(200).json({ message: "blog deleted successfully" });
  } catch (err) {
    console.log(err.message);
    response.status(500).json({ message: err.message });
  }
});

export default router;
