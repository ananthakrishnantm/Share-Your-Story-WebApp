import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { Link, useNavigate } from "react-router-dom";
import { LikeUnlikeComponent } from "./LikeUnlikeComponent";
import DisplayComments from "../CommentComponents/DisplayComments";

const FollowingUserBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [offset, setOffset] = useState(0);
  const limit = 5;
  const [loading, setLoading] = useState(false);
  const observer = useRef(null);
  const sentinelRef = useRef();
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchBlogData = useCallback(async () => {
    if (loading) return;
    setLoading(true);
    const path = `/blog/following/:userId/userlist?offset=${offset}&limit=${limit}`;
    const mainUrl = apiBaseUrl + path;
    try {
      const response = await axios.get(mainUrl, { withCredentials: true });
      setBlogs((prevBlogs) => [...prevBlogs, ...response.data.data]);
      setOffset((prevOffset) => prevOffset + limit);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  }, [loading, limit, offset, apiBaseUrl]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
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

  const formatDate = useCallback((timeStamp) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timeStamp).toLocaleString("en-US", options);
  }, []);

  return (
    <div className="flex-1 md:ml-36 lg:ml-48 xl:ml-48 ml-auto mr-1">
      {blogs.map((data) => (
        <div key={data._id} className="max-w-3xl mx-auto mb-1">
          <div
            className="bg-white rounded-md overflow-hidden shadow-custom"
            onClick={() => navigate(`/home/${data.user}/blogs/${data._id}`)}
          >
            <div className="ml-50vh flex">
              <div className="px-6 py- flex flex-1 flex-col">
                {data.userDetails && data.userDetails.profilePicture && (
                  <div className="flex justify-between items-center w-full">
                    <div onClick={(e) => e.stopPropagation()}>
                      <Link to={`/home/${data.user}/blogs`}>
                        <h1 className="font-bold text-base text-gray-700 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                          @{data.userDetails.username}
                        </h1>
                      </Link>
                    </div>
                    <div>
                      {/* Render the profile picture */}
                      <img
                        className="w-16 h-16 m-5 rounded-full"
                        src={`data:${data.userDetails.profilePicture.contentType};base64,${data.userDetails.profilePicture.data}`}
                        alt={data.userDetails.username}
                      />
                    </div>
                  </div>
                )}
                <div className="mb-10">
                  <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                    {data.title}
                  </h1>
                </div>
                <div>
                  <p
                    style={{ whiteSpace: "pre-wrap" }}
                    className="text-black text-base mb-5"
                  >
                    {data.content}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-base mb-5">
                    Created on: {formatDate(data.createdAt)}
                  </p>
                  <div>
                    <div className="flex gap-8 mb-4">
                      <div onClick={(e) => e.stopPropagation()}>
                        <LikeUnlikeComponent blogId={data._id} />
                      </div>
                      <div>
                        <DisplayComments blogId={data._id} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      {
        <div ref={sentinelRef} className="flex justify-center h-10">
          {loading && <p>Loading...</p>}
        </div>
      }
    </div>
  );
};

export default FollowingUserBlogList;
