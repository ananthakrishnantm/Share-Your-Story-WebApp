import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Buffer } from "buffer";

import MDEditor from "@uiw/react-md-editor";
import { AiOutlineUpload } from "react-icons/ai";

const UserBlogEdit = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const { blogId } = useParams();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const handleEditBlog = () => {
    const path = `/blog/user/:userId/blogs/${blogId}`;
    const apiUrl = apiBaseUrl + path;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    console.log(blogId);

    axios
      .put(apiUrl, formData, {
        withCredentials: true,
      })
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
    <div
      className="bg-neutral-950 rounded-md max-w-3xl mx-auto mb-4  overflow-hidden shadow-custom px-6 py-4"
      style={{ outline: "1px solid rgba(255, 255, 255, 0.1)" }}
    >
      <h1 className="font-bold  text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2 text-white">
        Edit Blog
      </h1>
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="Edit Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border-0  outline-none rounded-md upload-input-fields bg-zinc-800 text-white"
        />
        <textarea
          value={content}
          onChange={setContent}
          className="textarea textarea-bordered w-full p-2 border-0  outline-none bg-black rounded-md upload-input-fields text-white"
          style={{ maxHeight: "200px", minHeight: "100px", resize: "none" }}
        />
      </div>
      <div className="flex justify-between mt-4">
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
            className="inline-flex items-center py-2 px-8 bg-black-700 text-sm w-full  rounded-md font-bold text-white  hover:text-gray-800"
            style={{ outline: "1px solid rgba(255, 255, 255, 0.1)" }}
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
