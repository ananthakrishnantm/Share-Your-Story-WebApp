import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { Link, useNavigate, useParams } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { LikeUnlikeComponent } from "./UserComponents/LikeUnlikeComponent";
import CommentSection from "./UserComponents/CommentSection";

const AllUserBlogs = ({ triggerFetch }) => {
  const [blog, setBlog] = useState([]);
  const [profilePics, setProfilePics] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  // Callback functions using useCallback
  const fetchData = useCallback(async () => {
    const apiBaseUrl = import.meta.env.VITE_API_URL;
    const path = "/blog";
    try {
      const response = await axios.get(apiBaseUrl + path, {
        withCredentials: true,
      });

      const sortedBlogs = response.data.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setBlog(sortedBlogs);

      // Fetch profile pictures for each user
      const userIDs = sortedBlogs.map((blog) => blog.user);
      fetchProfilePics(userIDs);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const fetchProfilePics = useCallback(async (userIDs) => {
    try {
      const promises = userIDs.map((userID) =>
        axios.get(`http://localhost:3000/profile/blog/${userID}`, {
          withCredentials: true,
        })
      );

      const responses = await Promise.all(promises);
      const profilePicMap = {};

      responses.forEach((response) => {
        profilePicMap[response.data._id] = response.data;
      });

      setProfilePics(profilePicMap);
    } catch (error) {
      console.log(error);
    }
  }, []);

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
    fetchData();
  }, [fetchData, triggerFetch]);

  return (
    <div>
      <div className="flex justify-center text-black mb-5 "></div>
      {blog.map((data, index) => (
        <div key={index}>
          <div className="max-w-3xl mx-auto mb-1 ">
            <div className="bg-white rounded-md  overflow-hidden shadow-custom ">
              {data.image && (
                <img
                  className="w-full h-32 object-cover object-center"
                  src={`data:${data.image.contentType};base64,${Buffer.from(
                    data.image.data.data
                  ).toString("base64")}`}
                  alt={data.title}
                />
              )}
              {/*this is the second section*/}
              <div className="ml-50vh   flex ">
                <div className="px-6 py-4 flex flex-1 flex-col ">
                  {profilePics[data.user] &&
                    profilePics[data.user].profilePicture && (
                      <div className="flex justify-between items-center w-full ">
                        <div>
                          <Link
                            to={`/home/${profilePics[data.user]._id}/blogs`}
                          >
                            <h1 className="px-5 font-bold text-base text-gray-700 sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
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
                    <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-5">
                      {data.title}
                    </h1>
                  </div>
                  <div>
                    <MDEditor.Markdown
                      source={data.content}
                      style={{ whiteSpace: "pre-wrap" }}
                      className="text-black text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-20"
                    />
                  </div>
                  <div>
                    <p className="text-gray-600 md:text-lg mb-5">
                      Created on: {formatDate(data.createdAt)}
                    </p>
                    <LikeUnlikeComponent blogId={data._id} />
                    <CommentSection blogId={data._id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllUserBlogs;
