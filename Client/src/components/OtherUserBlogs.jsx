import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Buffer } from "buffer";
import "./userBlogs.css";

import { useNavigate, useParams } from "react-router-dom";
import { LikeUnlikeComponent } from "./UserComponents/LikeUnlikeComponent";
import DisplayComments from "./CommentComponents/DisplayComments";

function OtherUserBlogs() {
  const [userBlogs, setUserBlogs] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 5;
  const observer = useRef(null);
  const sentinelRef = useRef();
  const { userId } = useParams();
  const [loading, setLoading] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (loading) return;

    setLoading(true);
    const path = `/profile/users/${userId}/blogs?offset=${offset}&limit=${limit}`;
    const mainUrl = apiBaseUrl + path;

    try {
      const responseData = await axios.get(mainUrl, { withCredentials: true });
      setUserBlogs((prevBlogs) => [...prevBlogs, ...responseData.data.data]);
      setOffset((prevOffset) => prevOffset + 5);
      setLoading(false);
      console.log("this is the data", sortedBlogs);
    } catch (error) {
      console.log(error);
    }
  }, [loading, offset, limit, userId, apiBaseUrl]);

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

  console.log("this is the blog data");
  return (
    <div className="flex-1  md:ml-52 ml-auto lg:ml-48 xl:ml-48 mr-1 ">
      {userBlogs.map((blog, index) => (
        <div className="max-w-3xl mx-auto" key={index}>
          <div
            className="bg-white rounded-sm overflow-hidden mt-1"
            onClick={() => navigate(`/home/${blog.user}/blogs/${blog._id}`)}
          >
            {blog.image && blog.image.contentType && (
              <img
                className="w-full h-32 object-cover objct-center"
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
          </div>
        </div>
      ))}
      <div ref={sentinelRef}></div>
    </div>
  );
}

export default OtherUserBlogs;
