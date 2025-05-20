import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { Buffer } from "buffer";
import { Link, useParams } from "react-router-dom";
import FollowBtn from "../UserComponents/FollowBtn";

function OtherViewProfileSecondary() {
  const [data, setData] = useState([]);
  const { userId } = useParams(); // Get the userId from the URL
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  console.log("this is userId", userId);
  const profilePictureData = async () => {
    const path = `/profile/blog/${userId}`;
    const apiUrl = apiBaseUrl + path;

    try {
      const responseData = await axios.get(apiUrl, { withCredentials: true });
      setData(responseData.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    profilePictureData();
  }, [userId]); // Include userId in the dependency array to trigger the effect when it changes

  return (
    <div className="mt-10">
      <div className="bg-neutral-900 p-5 rounded-lg outline outline-1 outline-white/10">
        <div className=" flex flex-col items-center text-center mt-5 mb-2">
          <Avatar
            alt="User Avatar"
            sx={{ width: 120, height: 120, marginBottom: 2 }}
          >
            {data.profilePicture && (
              <img
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                src={`data:${
                  data.profilePicture.contentType
                };base64,${Buffer.from(data.profilePicture.data.data).toString(
                  "base64"
                )}`}
                alt={data.title}
              />
            )}
          </Avatar>
          <h5
            className="text-xl font-bold text-white p-5"
            style={{ fontSize: "24px" }}
          >
            {data.username}
          </h5>
          {/* {all the stuff is inside} */}
          <div className="flex justify-center m-4 mb-6 bg-white rounded-lg p-5">
            <p className="text-base mr-5 ">
              <strong>{data.following ? data.following.length : 0}</strong>{" "}
              <br />
              Following:
            </p>

            <p className="text-base mr-5">
              <strong>{data.followers ? data.followers.length : 0}</strong>{" "}
              <br />
              Followers:
            </p>
            <p className="text-base mr-5">
              <strong> {data.blogCount ? data.blogCount : 0} </strong> <br />{" "}
              Posts:
            </p>
          </div>
          <div>
            <div
              className=" text-white px-4 py-2 rounded-xl transition duration-300 hover:scale-105 rounded-t-xl"
              style={{ outline: "1px solid rgba(255, 255, 255, 0.1)" }}
            >
              <FollowBtn userId={userId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OtherViewProfileSecondary;
