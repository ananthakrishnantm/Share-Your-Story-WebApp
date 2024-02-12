import express from "express";

const logoutMethod = express.Router();

logoutMethod.post("/", (req, res) => {
  res.setHeader(
    `Set-Cookie`,
    `cookie=;expires= Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
  );
  res.status(200).json({ message: "logout successful" });
});

export default logoutMethod;
