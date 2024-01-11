import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";

const Home = () => {
  const [blog, setBlog] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/blog")
      .then((response) => {
        setBlog(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
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
    </div>
  );
};

export default Home;
