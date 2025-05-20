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
    const apiBaseUrl = import.meta.env.VITE_API_URL;
    const path = `/blog/uploads/`;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    axios
      .post(apiBaseUrl + path, formData, {
        withCredentials: true,
      })
      .then((response) => {
        // Define response as a parameter
        // After successful upload, dispatch an action to update the blog data
        const blogArray = [response.data];

        updateBlogList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  return (
    <div
      className="flex-1 xl:ml-48  md:mr-auto lg:ml-48 md:ml-36 lg:mt-5 "
      // style={{ marginLeft: "165px", marginRight: "1px" }}
    >
      <div
        className="bg-neutral-950 rounded-md max-w-3xl mx-auto mb-4  overflow-hidden shadow-custom px-6 py-4 "
        style={{ outline: "1px solid rgba(255, 255, 255, 0.1)" }}
      >
        <div className="flex flex-col">
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 mb-2 border-0  outline-none rounded-md upload-input-fields bg-zinc-800 text-white"
          />
          <textarea
            type="text"
            placeholder="Write here.."
            value={content}
            // onChange={setContent}
            onChange={(e) => setContent(e.target.value)}
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
              onClick={handleCreateBlog}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
