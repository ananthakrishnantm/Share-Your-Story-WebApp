import express, { request, response } from "express";
import { PORT, mongoDBURLS } from "./config.js";
import mongoose, { mongo } from "mongoose";
import { FoodBlog } from "./models/FoodBlogModel.js";
import foodRouter from "../Server/routes/BlogDataRoutes.js";
import userRouter from "./routes/RegistrationRoute.js";
import authRouter from "./routes/LoginRoutes.js";
import cors from "cors";
import logoutMethod from "./routes/LogoutRoute.js";
// import multer from "multer";

const app = express();

const corsOptions = {
  origin: "http://localhost:5173", // Replace with your actual frontend domain
  credentials: true,
};

app.use(cors(corsOptions));

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// app.use("/", upload.single("image"));

app.use(express.json());

// app.get("/", (req, res) => {
//   console.log(req);
//   return response.status(234).send("its successful");
// });

//route for blog

app.use("/blog", foodRouter);

//route for users
app.use("/signup", userRouter);

//route for Login
app.use("/login", authRouter);

app.use("/logout", logoutMethod);

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
