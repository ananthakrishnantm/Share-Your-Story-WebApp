import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { Link, useNavigate, useParams } from "react-router-dom";
import Upload from "./Upload";
import "../components/AllUserBlogs.css";

const AllUserBlogs = () => {
  const [blog, setBlog] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const { id } = useParams();

  const handleLogout = () => {
    navigate("/login");
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/blog", {
          withCredentials: true,
        });

        const sortedBlogs = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setBlog(sortedBlogs);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  const formatDate = (timeStamp) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timeStamp).toLocaleString("en-US", options);
  };

  // console.log(blog);
  return (
    <div>
      <div className="flex justify-center text-white ">
        <div>
          <Link to={`/home/userId`}>
            <button>my Blog</button>
          </Link>
        </div>
        |
        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
      {blog.map((data, index) => (
        <div key={index}>
          <div className="max-w-md mx-auto  ">
            <div className="bg-white rounded-sm  overflow-hidden shadow-custom">
              {data.image && (
                <img
                  className="w-full h-32 object-cover objct-center "
                  src={`data:${data.image.contentType};base64,${Buffer.from(
                    data.image.data.data
                  ).toString("base64")}`}
                  alt={data.title}
                />
              )}
              <div className="px-6 py-4">
                <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2">
                  {data.title}
                </h1>

                <p className="text-black text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                  {data.content}
                </p>
                <p className="text-gray-600 md:text-lg">
                  Created on:{formatDate(data.createdAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllUserBlogs;
