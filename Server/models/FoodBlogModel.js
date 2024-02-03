import mongoose from "mongoose";

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
  },

  {
    timestamps: true,
  }
);

export const FoodBlog = mongoose.model("Food-Blog", foodBlogSchema);
