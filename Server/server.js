import express, { request, response } from "express";
import { PORT, mongoDBURLS } from "./config.js";
import mongoose, { mongo } from "mongoose";
import { FoodBlog } from "./models/FoodBlogModel.js";
import foodRouter from "../Server/routes/BlogDataRoutes.js";
// import multer from "multer";

const app = express();

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// app.use("/", upload.single("image"));

app.use(express.json());

// app.get("/", (req, res) => {
//   console.log(req);
//   return response.status(234).send("its successful");
// });

app.use("/blog", foodRouter);

mongoose
  .connect(mongoDBURLS)
  .then(() => {
    console.log("connected to db");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
