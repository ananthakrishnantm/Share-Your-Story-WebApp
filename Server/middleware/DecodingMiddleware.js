import jwt from "jsonwebtoken";

const { JWT_SECRET_KEY } = process.env;

const decodedToken = (request, response, next) => {
  const cookies = request.headers.cookie;

  if (!cookies) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  const token = cookies.split("cookie=")[1];

  if (!token) {
    return response.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    request.userId = decodedToken.userId;
    next();
  } catch (error) {
    return response.status(401).json({ error: "Unauthorized" });
  }
};

export default decodedToken;
