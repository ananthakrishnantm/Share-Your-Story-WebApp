// services/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const emailHost = process.env.EMAIL_HOST;
const emailPort = process.env.EMAIL_PORT;
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: true,
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

export const sendVerificationEmail = async (email, verificationUrl) => {
  try {
    await transporter.sendMail({
      from: '"No Reply" <no-reply@example.com>', // Provide a friendly name
      to: email,
      subject: "Email Verification",
      html: `Click <a href="${verificationUrl}">here</a> to verify your email. Link expires after 1hr.`,
    });
    console.log("Verification email sent successfully");
  } catch (error) {
    console.error("Error sending verification email:", error.message);
    // You could handle specific errors here, or retry sending the email
    throw new Error("Failed to send verification email");
  }
};
