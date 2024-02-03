import jwt from "jsonwebtoken";

const { JWT_SECRET_KEY } = process.env;

const decodedToken = (request, response, next) => {
  const cookies = request.headers.cookie;

  if (!cookies) {
    return response.redirect("/error-page");
  }

  const token = cookies.split("cookie=")[1];

  if (!token) {
    return response.status(401).json({ message: "unauthorized login" });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    request.userId = decodedToken.userId;
    next();
  } catch (err) {
    return response.status(401).json({ message: "unauthorized login" });
  }
};

export default decodedToken;
