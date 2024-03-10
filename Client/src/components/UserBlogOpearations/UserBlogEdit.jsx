import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Buffer } from "buffer";

import { AiOutlineUpload } from "react-icons/ai";
import MDEditor from "@uiw/react-md-editor";

const UserBlogEdit = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const { blogId } = useParams();
  const navigate = useNavigate();

  const handleEditBlog = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    console.log(blogId);

    axios
      .put(
        `http://localhost:3000/blog/user/:userId/blogs/${blogId}`,
        formData,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        navigate("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="bg-white rounded-lg max-w-md mx-auto mb-4 overflow-hidden shadow-custom px-6 py-4">
      <h1 className="font-bold  text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2 text-black">
        Edit Blog
      </h1>
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="Edit Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border rounded-md upload-input-fields"
        />
        <MDEditor
          value={content}
          onChange={setContent}
          className="w-full p-2 border rounded-md upload-input-fields"
        />
      </div>
      <div className="flex justify-between mt-2">
        <div>
          <label htmlFor="file-input">
            <AiOutlineUpload className="w-8 h-8  imageColor" />
          </label>
          <input
            id="file-input"
            className="hidden"
            type="file"
            accept="*"
            onChange={handleImageChange}
          />
        </div>
        <div>
          <button
            className="bg-gray-500 text-sm rounded-full p-2 text-white hover:bg-gray-700"
            onClick={handleEditBlog}
          >
            Update Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserBlogEdit;
