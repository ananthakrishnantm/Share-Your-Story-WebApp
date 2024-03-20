import { FoodBlog } from "../models/FoodBlogModel.js";
import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";

const httpServer = createServer();
const io = new Server(httpServer); // Create Socket.io server

// Socket.io event for fetching all blog posts
io.on("connection", (socket) => {
  console.log("A user connected");

  // Listen for fetchBlogs event emitted by clients
  socket.on("fetchBlogs", async (data) => {
    try {
      // Perform authentication using the provided token
      const decoded = jwt.verify(data.token, process.env.JWT_SECRET);

      // Fetch all blog posts where isDeleted is false
      const blogs = await FoodBlog.find({ isDeleted: false });

      // Emit blogs data to the client
      socket.emit("blogsData", { count: blogs.length, data: blogs });
    } catch (error) {
      console.error("Error fetching blogs:", error.message);
    }
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

httpServer.listen(3000, () => {
  console.log("Socket.io server is running on port 3000");
});
