import React, { useEffect, useState } from "react";
import axios from "axios";

const DisplayComments = ({ blogId }) => {
  const [commentData, setCommentData] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  // console.log("this is the blog id", blogId);
  // console.log("this is the user id", userId);

  const displayComments = () => {
    const path = `/blog/user/blogs/${blogId}/comments`;
    const apiUrl = apiBaseUrl + path;
    axios
      .get(apiUrl, {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.data) {
          setCommentData(response.data.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    displayComments();
  }, []);

  // Calculate the total number of comments
  const totalComments = commentData.reduce(
    (acc, item) => acc + item.comments.length,
    0
  );

  return (
    <div>
      <div className="flex gap-2">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.5em"
            height="1.5em"
            viewBox="0 0 24 24"
          >
            <path
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 21a9 9 0 1 0-7.605-4.185L3 21l4.185-1.395A8.958 8.958 0 0 0 12 21"
            />
          </svg>
        </div>
        <div>{totalComments}</div>
      </div>
    </div>
  );
};

export default DisplayComments;
