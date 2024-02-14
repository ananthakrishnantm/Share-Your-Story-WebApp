import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
import "./Upload.css";
import { AiOutlineUpload } from "react-icons/ai";

const Upload = ({ updateBlogList }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  // Access the dispatch function from the context

  const navigate = useNavigate();

  const handleCreateBlog = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    axios
      .post("http://localhost:3000/blog/uploads/", formData, {
        withCredentials: true,
      })
      .then((response) => {
        // Define response as a parameter
        // After successful upload, dispatch an action to update the blog data
        const blogArray = [response.data];

        updateBlogList();
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
