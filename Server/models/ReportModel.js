import mongoose from "mongoose";

const ReportSchema = mongoose.Schema({
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  blogUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reportedBlog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food-Blog",
    required: true,
  },
  reportCount: { type: Number, default: 1 },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Report = mongoose.model("Report", ReportSchema);
