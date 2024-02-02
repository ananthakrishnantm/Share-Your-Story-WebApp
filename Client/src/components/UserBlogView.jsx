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
      .get(``)
      .then((response) => {
        setBlog(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [blogId]);

  return <div>Vewing The Blog</div>;
}

export default UserBlogView;
