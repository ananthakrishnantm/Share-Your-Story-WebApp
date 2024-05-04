import express from "express";
import http from "http";
import SocketServer from "./SocketServer.js"; // Import the SocketServer function
import { PORT, mongoDBURLS } from "./config.js";
import mongoose from "mongoose";
import { FoodBlog } from "./models/FoodBlogModel.js";
import foodRouter from "../Server/routes/BlogDataRoutes.js";
import registerRouter from "./routes/RegistrationRoute.js";
import authRouter from "./routes/LoginRoutes.js";
import cors from "cors";
import logoutMethod from "./routes/LogoutRoute.js";
import user from "./routes/UserDataRoutes.js";
import followerRoute from "./routes/FollowersData.js";
import { Server } from "socket.io"; // Import Server from the socket.io package
// import { dirname, join } from "path";
import { fileURLToPath } from "url";
import path from "path";

const { origin_Link } = process.env;
const app = express();
const server = http.createServer(app); // Create the HTTP server

const corsOptions = {
  origin: origin_Link, // Replace with your actual frontend domain
  credentials: true,
};

app.use(cors(corsOptions));

// Create the Socket.IO instance
const io = new Server(server, {
  cors: {
    origin: origin_Link,
    methods: ["GET", "POST"],
  },
});
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, "../Client/dist")));

// Attach the event listener using the imported SocketServer function
io.on("connection", (socket) => {
  SocketServer(socket, io); // Pass socket and io to SocketServer
});

// ... (the rest of your code remains the same)

// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });
// app.use("/", upload.single("image"));

app.use(express.json());

// app.get("/", (req, res) => {
// console.log(req);
// return response.status(234).send("its successful");
// });

app.use("/api/profile", user);

//route for blog
app.use("/api/blog", foodRouter);

//route for users
app.use("/api/signup", registerRouter);

//route for Login
app.use("/api/login", authRouter);

app.use("/api/logout", logoutMethod);

app.use("/api/follower", followerRoute);

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../Client/dist", "index.html"));
// });

//using sockets for blogs
mongoose
  .connect(mongoDBURLS)
  .then(() => {
    console.log("connected to db");
  })
  .catch((err) => {
    console.log(err);
  });

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
