import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Buffer } from "buffer";
import Avatar from "@mui/material/Avatar";
import FollowBtn from "./FollowBtn";
import "../userBlogs.css";
import { LikeUnlikeComponent } from "./LikeUnlikeComponent";
import DisplayComments from "../CommentComponents/DisplayComments";

const SearchProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const offset = useRef(0);
  const [hasMore, setHasMore] = useState(true);
  const [count, setCount] = useState(0);
  const limit = 5;
  const observer = useRef(null);
  const sentinelRef = useRef();
  const navigate = useNavigate();
  const [userBlogs, setUserBlogs] = useState([]);
  const { userId } = useParams();
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const fetchUserData = useCallback(async () => {
    const path = `/profile/blog/${userId}`;
    const apiUrl = apiBaseUrl + path;
    try {
      const response = await axios.get(apiUrl, { withCredentials: true });
      setUserData(response.data);
      console.log("Fetched userData:", response.data);
    } catch (error) {
      console.error("Error fetching user data", error);
    }
  }, [userId, apiBaseUrl]);

  const fetchBlogData = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    console.log("Fetching blog data with offset", offset.current);

    const path = `/blog/${userId}/blogs?offset=${offset.current}&limit=${limit}`;
    const apiUrl = apiBaseUrl + path;

    try {
      const response = await axios.get(apiUrl, { withCredentials: true });
      const { data: blogs, count: blogCount } = response.data;

      setUserBlogs((prevBlogs) => [...prevBlogs, ...blogs]);
      setCount(blogCount);
      offset.current += limit;

      if (blogs.length < limit) setHasMore(false);

      console.log("Fetched blog data", blogs);
    } catch (error) {
      console.error("Error fetching blog data", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, userId, apiBaseUrl, limit]);

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

  useEffect(() => {
    console.log("userId changed:", userId);
    setUserBlogs([]);
    offset.current = 0;
    setHasMore(true);
    setUserData(null); // Clear user data on user change
    fetchUserData();
  }, [userId, fetchUserData]);

  useEffect(() => {
    if (userData) {
      fetchBlogData();
    }
  }, [userData]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log("Sentinel intersecting, fetching more data...");
        fetchBlogData();
      }
    });

    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [fetchBlogData]);

  return (
    <div className="flex flex-col items-center w-full mt-5 md:ml-36 lg:ml-36 xl:ml-36 mr-10">
      {userData && (
        <div
          className="bg-neutral-950 w-full max-w-3xl rounded-xl border-1 py-4 mb-5"
          style={{ outline: "1px solid rgba(255, 255, 255, 0.1)" }}
        >
          <div className="flex flex-col items-center text-center mt-5 mb-5">
            <Avatar
              alt="User Avatar"
              sx={{ width: 120, height: 120, marginBottom: 2 }}
            >
              {userData.profilePicture && (
                <img
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  src={`data:${
                    userData.profilePicture.contentType
                  };base64,${Buffer.from(userData.profilePicture.data).toString(
                    "base64"
                  )}`}
                  alt={userData.username}
                />
              )}
            </Avatar>
            <h1 className="text-white text-3xl font-sans font-medium">
              {userData.username}
            </h1>
            <div className="flex justify-center m-10 bg-white rounded-md p-8">
              <h1 className="ml-10 mr-10">
                <strong>
                  {userData.following ? userData.following.length : 0}
                </strong>
                <br />
                Following:
              </h1>
              <h1 className="mr-10">
                <strong>
                  {userData.followers ? userData.followers.length : 0}
                </strong>
                <br />
                Followers:
              </h1>
              <h1 className="mr-10">
                <strong>{count}</strong>
                <br /> Posts:
              </h1>
            </div>
            <div
              className=" text-white px-4 py-2 rounded-xl transition duration-300 hover:scale-105 rounded-t-xl"
              style={{ outline: "1px solid rgba(255, 255, 255, 0.1)" }}
            >
              <FollowBtn className="ml-10 mr-10" userId={userId} />
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-3xl my-4">
        {userBlogs.length === 0 ? (
          <h1 className="text-3xl text-center font-bold">No posts yet</h1>
        ) : (
          <div>
            {userBlogs.map((blog, index) => (
              <div key={index}>
                <div
                  className="bg-white rounded-md overflow-hidden shadow-custom mb-1"
                  onClick={() =>
                    navigate(`/home/${blog.user}/blogs/${blog._id}`)
                  }
                >
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
                    <h1 className="font-bold text-xl mb-2">{blog.title}</h1>
                    <p
                      className="text-black text-base mb-5"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {blog.content}
                    </p>
                    <p className="text-gray-600 text-base mb-5">
                      Created on: {formatDate(blog.createdAt)}
                    </p>
                    <div className="flex gap-8 mb-4">
                      <div onClick={(e) => e.stopPropagation()}>
                        <LikeUnlikeComponent blogId={blog._id} />
                      </div>
                      <div>
                        <DisplayComments blogId={blog._id} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div
        ref={sentinelRef}
        className="flex justify-center text-white w-full max-w-3xl h-10"
      >
        {loading && <p>Loading....</p>}
      </div>
    </div>
  );
};

export default SearchProfile;
