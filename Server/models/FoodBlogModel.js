import mongoose from "mongoose";

const commentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const likeSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const foodBlogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },

    image: {
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
    likes: [likeSchema],
    comments: [commentSchema],
    likesCount: {
      type: Number,
      default: 0,
    },
  },

  {
    timestamps: true,
  }
);

export const FoodBlog = mongoose.model("Food-Blog", foodBlogSchema);
