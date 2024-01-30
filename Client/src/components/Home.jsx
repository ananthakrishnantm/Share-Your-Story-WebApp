import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { Link, useNavigate, useParams } from "react-router-dom";

const Home = () => {
  const [blog, setBlog] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      axios
        .get("http://localhost:3000/blog")
        .then((response) => {
          setBlog(response.data.data);
          console.log(token);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("ur not logged in");
      navigate("/login");
    }
  }, []);

  console.log(blog);
  return (
    <div>
      {blog.map((data, index) => (
        <div key={index}>
          <h1>{data.title}</h1>
          {data.image && (
            <img
              src={`data:${data.image.contentType};base64,${Buffer.from(
                data.image.data.data
              ).toString("base64")}`}
              alt={blog.title}
            />
          )}
          <h2>{data.content}</h2>
        </div>
      ))}
      <div>
        <Link to={"/upload"}>
          <button>New Blog</button>
        </Link>
        <Link to={`/user/$`}>
          <button>my Blog</button>
        </Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Home;
