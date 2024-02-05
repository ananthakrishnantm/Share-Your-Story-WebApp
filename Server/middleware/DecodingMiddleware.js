import jwt from "jsonwebtoken";

const { JWT_SECRET_KEY } = process.env;

const decodedToken = (request, response, next) => {
  const cookies = request.headers.cookie;

  if (!cookies) {
    return response.status(404);
  }

  const token = cookies.split("cookie=")[1];

  if (!token) {
    return response.status(404);
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET_KEY);
    request.userId = decodedToken.userId;
    next();
  } catch (err) {
    return response.status(404);
  }
};

export default decodedToken;
