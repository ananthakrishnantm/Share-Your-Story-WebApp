import mongoose from "mongoose";

const foodBlogSchema = mongoose.Schema(
  {
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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },

  {
    timestamps: true,
  }
);

export const FoodBlog = mongoose.model("Food-Blog", foodBlogSchema);
