import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Buffer } from "buffer";
import CommentSection from "../UserComponents/CommentSection";
import { LikeUnlikeComponent } from "../UserComponents/LikeUnlikeComponent";
import DisplayComments from "../CommentComponents/DisplayComments";

function OtherIndividualBlog() {
  const [blog, setBlog] = useState();

  const [loggedIn, setLoggedIn] = useState(false);
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  const { blogId, userId } = useParams();
  const navigate = useNavigate();

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

  const handleView = async () => {
    const path = `/blog/user/:userId/blogs/${blogId}/views`;
    const apiUrl = apiBaseUrl + path;
    try {
      //for post it needs an empty body else wont work
      await axios.post(apiUrl, {}, { withCredentials: true });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleView();
    const path = `/blog/otherUser/${userId}/blogs/${blogId}`;
    const apiUrl = apiBaseUrl + path;
    axios
      .get(apiUrl, {
        withCredentials: true,
      })
      .then((response) => {
        setBlog(response.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="background-color flex-1  md:ml-48 lg:ml-48 xl:ml-48 ml-auto mr-1">
      {blog && (
        <div className="max-w-3xl mx-auto">
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

            <div className="px-6 py-4">
              <CommentSection blogId={blog._id} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OtherIndividualBlog;
