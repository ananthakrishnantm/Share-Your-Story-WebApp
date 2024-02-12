import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  dateOfBirth: { type: Date },
  profilePicture: { type: String },
  phoneNumber: { type: String },
  accountStatus: {
    type: String,
    enum: ["active", "inactive", "suspended"],
    default: "active",
  },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const User = mongoose.model("User", userSchema);
