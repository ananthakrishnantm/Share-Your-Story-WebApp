import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UserBlogs() {
  const [userBlog, setUserBlog] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const { userID } = useParams();

  useEffect(() => {
    // const token = localStorage.getItem("token");
    if (token) {
      //   const token = localStorage.getItem("token");

      setLoggedIn(true);
      axios
        .get(`http://localhost:3000/blog/user/${userID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        .then((response) => {
          setUserBlog(response.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("ur nor logged in");
      navigate("/login");
    }
  }, userID);
  console.log(userBlog);

  return (
    <div>
      UserBlog
      {userBlog.map((data, index) => (
        <div key={index}>
          <h1>{data.title}</h1>
          {data.image && (
            <img
              src={`data:${data.image.contentType};base64,${Buffer.from(
                data.image.data.data
              ).toString("base64")}`}
              alt={userBlog.title}
            />
          )}
          <h2>{data.content}</h2>
        </div>
      ))}
    </div>
  );
}

export default UserBlogs;
