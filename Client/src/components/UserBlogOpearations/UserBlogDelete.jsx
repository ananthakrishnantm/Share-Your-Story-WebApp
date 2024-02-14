import axios from "axios";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserBlogDelete = ({ blogId }) => {
  const navigate = useNavigate();

  const handleDeleteBlog = () => {
    axios
      .delete(`http://localhost:3000/blog/user/:userId/blogs/${blogId}`, {
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
