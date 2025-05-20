import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  Name: { type: String, required: true },
  dateOfBirth: { type: Date },
  profilePicture: {
    name: {
      type: String,
    },
    data: {
      type: Buffer,
    },
    contentType: {
      type: String,
    },
  },
  phoneNumber: { type: String },
  accountStatus: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
  role: { type: [String], enum: ["admin", "user"], default: ["user"] },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  googleId: { type: String, unique: true, sparse: true },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  blogCount: { type: Number, default: 0 },
  color: { type: String },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false },
  blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  blockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  verifyExpires: {
    type: Date,
    // TTL index: expires 1 hour after account creation if not verified
    expires: "1h",
    default: null, // Set when account is created
  },
});

// Middleware to set verifyExpires only if the user is not verified
userSchema.pre("save", function (next) {
  if (!this.isVerified && !this.verifyExpires) {
    // Set verifyExpires when the user is not verified
    this.verifyExpires = Date.now();
  } else if (this.isVerified) {
    // Remove verifyExpires if the user is verified
    this.verifyExpires = undefined;
  }
  next();
});

export const User = mongoose.model("User", userSchema);
