import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserBlogDelete = ({ blogId }) => {
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const handleDeleteBlog = () => {
    const path = `/blog/user/:userId/blogs/${blogId}`;
    const apiUrl = apiBaseUrl + path;

    axios
      .delete(apiUrl, {
        withCredentials: true,
      })
      .then(() => {
        navigate("/home");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return <button onClick={handleDeleteBlog}>DeleteBlog</button>;
};

export default UserBlogDelete;
