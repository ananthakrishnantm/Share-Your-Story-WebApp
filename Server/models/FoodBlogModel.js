import mongoose from "mongoose";

const foodBlogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
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
  },

  {
    timestamps: true,
  }
);

export const FoodBlog = mongoose.model("Food-Blog", foodBlogSchema);
