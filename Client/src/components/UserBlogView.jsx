import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UserBlogView() {
  const [blog, setBlog] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  const { blogId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/user/:userId/blogs/${blogId}`, {
        withCredentials: true,
      })
      .then((response) => {
        setBlog(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [blogId]);

  console.log(blogId);

  return <div>Vewing The Blog</div>;
}

export default UserBlogView;
