import axios from "axios";
import React, { useState, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [user, SetUser] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Fetch user ID from localStorage when the component mounts
  // const userId = localStorage.getItem("userId");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
    } else {
      console.log("You are not logged in");
      navigate("/login");
    }
  }, []);

  const handleCreateBlog = () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    // Include the user ID

    const token = localStorage.getItem("token");
    formData.append("user", token);

    axios
      .post("http://localhost:3000/blog/uploads/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
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
    <div>
      <h1>Upload</h1>
      <div>
        <label>Title:</label>
        <input type="text" onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <label>Image: </label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <div>
        <label>Content:</label>
        <input type="text" onChange={(e) => setContent(e.target.value)} />
      </div>
      <div>
        <button onClick={handleCreateBlog}>Add New</button>
      </div>
    </div>
  );
};

export default Upload;
