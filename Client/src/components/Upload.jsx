import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import "./Upload.css";
import { AiOutlineUpload } from "react-icons/ai";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [user, SetUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Fetch user ID from localStorage when the component mounts
  // const userId = localStorage.getItem("userId");

  const handleCreateBlog = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    // Include the user ID

    // formData.append("user", token);

    axios
      .post("http://localhost:3000/blog/uploads/", formData, {
        withCredentials: true,
      })
      .then(() => {
        //sends to globalstate
        dispatch({
          type: "SET_BLOG_DATA",
          payload: { title, content, image },
        });

        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div className="bg-white rounded-lg max-w-md mx-auto mb-4 overflow-hidden shadow-custom px-6 py-4">
      <h1 className="font-bold  text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2 text-black">
        Create New Blog
      </h1>
      <div className="flex flex-col">
        <input
          type="text"
          placeholder="Blog Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 mb-2 border rounded-md upload-input-fields"
        />
        <textarea
          placeholder="Write your blog here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
            onClick={handleCreateBlog}
          >
            Publish Blog
          </button>
        </div>
      </div>
    </div>
  );
};

export default Upload;
