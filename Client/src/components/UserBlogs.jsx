import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Buffer } from "buffer";
import "./userBlogs.css";
import { Link, useNavigate } from "react-router-dom";
import UserBlogDelete from "./UserBlogOpearations/UserBlogDelete";
import Navbar from "./Navbar";
import { LikeUnlikeComponent } from "./UserComponents/LikeUnlikeComponent";
import DisplayComments from "./CommentComponents/DisplayComments";

function UserBlogs() {
  const [userBlogs, setUserBlogs] = useState([]);
  const observer = useRef(null);
  const sentinelRef = useRef();
  const [offset, setOffset] = useState(0);
  const limit = 5;
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const navigate = useNavigate();
  const handleHome = () => {
    navigate("/home");
  };

  const fetchData = useCallback(() => {
    if (loading) return;
    setLoading(true);

    const path = `/blog/user/:userId/blogs?offset=${offset}&limit=${limit}`;
    const mainUrl = apiBaseUrl + path;

    console.log("this is the main url", mainUrl);
    axios
      .get(mainUrl, {
        withCredentials: true,
      })
      .then((response) => {
        const sortedBlogs = response.data.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setUserBlogs((prevBlogs) => [...prevBlogs, ...sortedBlogs]);
        setOffset((prevOffset) => prevOffset + limit);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [loading, limit, offset, apiBaseUrl]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchData();
      }
    });

    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [fetchData]);

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

  return (
    <>
      <div className=" flex-1  md:ml-36 lg:ml-48 xl:ml-48 ml-auto mr-1">
        {userBlogs.map((blog, index) => (
          <div className="max-w-3xl mx-auto" key={index}>
            <div className="bg-white rounded-sm overflow-hidden mt-1">
              {blog.image && blog.image.contentType && (
                <img
                  className="w-full h-32 object-cover object-center"
                  src={`data:${blog.image.contentType};base64,${Buffer.from(
                    blog.image.data.data
                  ).toString("base64")}`}
                  alt={blog.title}
                />
              )}
              <div className="px-6 py-4">
                <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-2">
                  {blog.title}
                </h1>
                <p
                  style={{ whiteSpace: "pre-wrap" }}
                  className="text-black text-base"
                >
                  {blog.content}
                </p>
                <p className="text-gray-600 text-sm">
                  Created on: {formatDate(blog.createdAt)}
                </p>
              </div>
              <div className="flex gap-8 mb-4 px-6 ">
                <div onClick={(e) => e.stopPropagation()}>
                  <LikeUnlikeComponent blogId={blog._id} />
                </div>
                <div>
                  <DisplayComments blogId={blog._id} />
                </div>
              </div>
              <div className="mb-5 px-6">
                <Link to={`/home/userId/View/${blog._id}`}>
                  <button>ViewBlog</button>
                </Link>
                |
                <Link to={`/home/userId/Edit/${blog._id}`}>
                  <button>EditBlog</button>
                </Link>
                |
                <UserBlogDelete blogId={blog._id} />
              </div>
            </div>
          </div>
        ))}

        <div ref={sentinelRef} className="flex justify-center h-10 text-white">
          {loading && <p>Loading...</p>}
        </div>
      </div>
    </>
  );
}

export default UserBlogs;
