import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Buffer } from "buffer";
import MDEditor from "@uiw/react-md-editor";

function UserBlogView() {
  const [blog, setBlog] = useState();
  const [loggedIn, setLoggedIn] = useState(false);

  const { blogId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/blog/user/:userId/blogs/${blogId}`, {
        withCredentials: true,
      })
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
      <h1>My Blog</h1>
      <div>
        {blog &&
          blog.map((data, index) => (
            <div key={index}>
              {data.image && (
                <img
                  className="w-full h-32 object-cover object-center"
                  src={`data:${data.image.contentType};base64,${Buffer.from(
                    data.image.data.data
                  ).toString("base64")}`}
                  alt={data.title}
                />
              )}
              <h2>{data.title}</h2>
              <MDEditor.Markdown
                source={data.content}
                style={{ whiteSpace: "pre-wrap" }}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default UserBlogView;
