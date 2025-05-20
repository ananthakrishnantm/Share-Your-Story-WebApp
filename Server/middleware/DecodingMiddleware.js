import jwt from "jsonwebtoken";
import { User } from "../models/UsersModel.js";
import dotend from "dotenv";

dotend.config();

const { JWT_SECRET_KEY } = process.env;

//verify the jwt token
const decodedToken = async (request, response, next) => {
  try {
    const cookies = request.headers.cookie;

    if (!cookies) {
      console.log("No cookies found");
      return response.status(401).json({ error: "Unauthorized" });
    }

    const jwtToken = cookies.split("cookie=")[1];

    if (!jwtToken) {
      console.log("No token found");
      return response.status(401).json({ error: "Unauthorized" });
    }

    const tokenArray = jwtToken.split(";");
    const token = tokenArray[0].trim();

    if (!token) {
      console.log("No token found");
      return response.status(401).json({ error: "Unauthorized" });
    }

    const decodedTokenused = jwt.verify(token, JWT_SECRET_KEY);

    request.userId = decodedTokenused.userId;
    request.role = decodedTokenused.role;

    const user = await User.findById(request.userId);
    if (!user) {
      console.log("User not found");
      return response.status(401).json({ error: "Unauthorized" });
    }
    if (user.isBanned) {
      return response.status(403).json({ error: "User is banned" });
    }

    // console.log("token main", decodedToken);
    next();
  } catch (error) {
    console.error("Error in decodedToken middleware:", error);
    return response.status(401).json({ error: "Unauthorized" });
  }
};

export default decodedToken;
