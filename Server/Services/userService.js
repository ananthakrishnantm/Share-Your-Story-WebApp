import crypto from "crypto";
import { sendVerificationEmail } from "./emailService.js";

import { User } from "../models/UsersModel.js";
import { EmailVerificationToken } from "../models/EmailVerificationToken.js";

export const createVerificationToken = async (User) => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  await EmailVerificationToken.create({
    userId: User._id,
    token: verificationToken,
  });
  //this is the verification link
  const baseUrl = process.env.origin_Link;
  const redirectUrl = `/EmailTokenVerification?token=${verificationToken}`;
  const verificationUrl = baseUrl + redirectUrl;

  //till here
  await sendVerificationEmail(User.email, verificationUrl);
};

export const verifyEmailToken = async (token) => {
  const verificationToken = await EmailVerificationToken.findOne({ token });

  if (!verificationToken) {
    return { success: false, message: "Invalid or expired token." };
  }

  const user = await User.findById(verificationToken.userId);

  if (!user) {
    return { success: false, message: "Invalid user." };
  }

  user.isVerified = true;
  //removes verify expires from 
  user.verifyExpires = undefined;
  await user.save();

  await EmailVerificationToken.deleteOne({ token });

  return { success: true };
};
