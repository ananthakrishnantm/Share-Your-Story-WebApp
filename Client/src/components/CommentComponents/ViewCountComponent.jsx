import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewCountComponent = ({ blogId }) => {
  const [viewData, setViewData] = useState([]);
  const apiBaseUrl = import.meta.env.VITE_API_URL;
  // console.log("this is the blog id", blogId);
  // console.log("this is the user id", userId);

  const displayViewCount = async () => {
    try {
      const path = `/blog/user/blogs/${blogId}/viewCount`;
      const apiUrl = apiBaseUrl + path;
      axios
        .get(apiUrl, {
          withCredentials: true,
        })
        .then((response) => {
          if (response) {
            setViewData(response.data);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  };
  // console.log("this is the view data", viewData);

  useEffect(() => {
    displayViewCount();
  }, []);

  return (
    <div>
      <div className="flex gap-2">
        <div>
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-width="2"
              d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
            />
            <path
              stroke="currentColor"
              stroke-width="2"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>
        <div>{viewData}</div>
      </div>
    </div>
  );
};

export default ViewCountComponent;
