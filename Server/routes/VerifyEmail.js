import express from "express";
import { verifyEmail } from "../Controller/emailverification.js";

const emailVerifyRouter = express.Router();

emailVerifyRouter.get("/", verifyEmail);

export default emailVerifyRouter;
