import axios from "axios";
import React, { useEffect, useState } from "react";
import { Buffer } from "buffer";
import "./userBlogs.css";

import { useNavigate } from "react-router-dom";

function jwtDecode(t) {
  let token = {};
  token.raw = t;
  token.header = JSON.parse(window.atob(t.split(".")[0]));
  token.payload = JSON.parse(window.atob(t.split(".")[1]));
  return token;
}

function UserBlogs() {
  const [userData, setUserData] = useState({});
  const [userBlogs, setUserBlogs] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode the token to get user information
        const decodedToken = jwtDecode(token);
        const userIdFromToken = decodedToken.payload.userId;

        setLoggedIn(true);

        // Fetch user details and blogs together
        axios
          .get(`http://localhost:3000/blog/user/${userIdFromToken}/blogs`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            setUserBlogs(response.data);
          })
          .catch((err) => {
            console.log(err);
          });
      } catch (error) {
        console.log("Error decoding token:", error);
        navigate("/login");
      }
    } else {
      console.log("You are not logged in");
      navigate("/login");
    }
  }, [navigate]);

  console.log(userBlogs);

  return (
    <div>
      <h1>My Blogs</h1>
      {userBlogs.map((blog, index) => (
        <div className="card" key={index}>
          <h2>{blog.title}</h2>
          <h2>{blog.content}</h2>
          {/*Always perfome the checks if to see if the item is present*/}
          {blog.image && blog.image.contentType && (
            <img
              src={`data:${blog.image.contentType};base64,${Buffer.from(
                blog.image.data.data
              ).toString("base64")}`}
              alt={blog.title}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default UserBlogs;
