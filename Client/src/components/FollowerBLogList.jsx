import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { Link, useNavigate, useParams } from "react-router-dom";
import { LikeUnlikeComponent } from "./UserComponents/LikeUnlikeComponent";
import CommentSection from "./UserComponents/CommentSection";
import path from "path";
import DisplayComments from "./CommentComponents/DsiplayComments";

const FollowerBLogList = ({ triggerFetch }) => {
  const [blogs, setBlogs] = useState([]);
  const [profilePics, setProfilePics] = useState({});
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(5); // Fixed limit
  const observer = useRef(null);
  const sentinelRef = useRef();
  const navigate = useNavigate();
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const fetchData = useCallback(async () => {
    const path = `/blog?offset=${offset}&limit=${limit}`;
    const mainUrl = apiBaseUrl + path;

    try {
      
      setLoading(true);

      const response = await axios.get(mainUrl, {
        withCredentials: true,
      });

      const sortedBlogs = response.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setBlogs((prevBlogs) => [...prevBlogs, ...sortedBlogs]);
      setOffset((prevOffset) => prevOffset + 5);

      const userIDs = sortedBlogs.map((blog) => blog.user);
      fetchProfilePics(userIDs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [apiBaseUrl, offset, limit]);

  const fetchProfilePics = useCallback(
    async (userIDs) => {
      try {
        
        const profilePicMap = { ...profilePics };

        for (const userID of userIDs) {
          if (!profilePicMap[userID]) {
            const response = await axios.get(
              apiBaseUrl + `/profile/blog/${userID}`,
              {
                withCredentials: true,
              }
            );

            profilePicMap[response.data._id] = response.data;
          }
        }

        setProfilePics(profilePicMap);
      } catch (error) {
        console.log(error);
      }
    },
    [apiBaseUrl, profilePics]
  );

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

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchData();
      }
    });

    if (sentinelRef.current) {
      observer.current.observe(sentinelRef.current);
    }
  }, [loading, offset, fetchData, triggerFetch]);

  return (
    <div>
      {blogs.map((data) => (
        <div key={data._id} className="max-w-3xl mx-auto mb-1">
          <div
            className="bg-white rounded-md overflow-hidden shadow-custom"
            onClick={() => navigate(`/home/${data.user}/blogs/${data._id}`)}
          >
            {data.image && (
              <img
                className="w-full h-32 object-cover object-center"
                src={`data:${data.image.contentType};base64,${Buffer.from(
                  data.image.data.data
                ).toString("base64")}`}
                alt={data.title}
              />
            )}
            <div className="ml-50vh flex">
              <div className="px-6 py- flex flex-1 flex-col">
                {profilePics[data.user] &&
                  profilePics[data.user].profilePicture && (
                    <div className="flex justify-between items-center w-full">
                      <div onClick={(e) => e.stopPropagation()}>
                        <Link to={`/home/${profilePics[data.user]._id}/blogs`}>
                          <h1 className="font-bold text-base text-gray-700 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
                            @{profilePics[data.user].username}
                          </h1>
                        </Link>
                      </div>
                      <div>
                        <img
                          className="w-16 h-16 m-5 rounded-full"
                          src={`data:${
                            profilePics[data.user].profilePicture.contentType
                          };base64,${Buffer.from(
                            profilePics[data.user].profilePicture.data.data
                          ).toString("base64")}`}
                          alt={profilePics[data.user].username}
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
                    {/* <div>
                      <CommentSection blogId={data._id} />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div ref={sentinelRef} className="flex justify-center mt-5">
        {loading && <p>Loading...</p>}
      </div>
    </div>
  );
};

export default FollowerBLogList;
